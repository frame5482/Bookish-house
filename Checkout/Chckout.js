let orderData = [];

function loadCart() {
    fetch('/getOrderDetail', { credentials: 'same-origin' })  // เรียก API
        .then(res => res.json())
        .then(data => {
            orderData = data.items || [];  // ใช้ตัวแปร global ไม่ประกาศใหม่
            renderCart(orderData);         // เรียกฟังก์ชัน render
        })
        .catch(err => {
            console.error('โหลดข้อมูล OrderDetail จาก Server ล้มเหลว:', err);
            const cartList = document.getElementById('cart-list');
            cartList.innerHTML = '<div class="cart-empty">เกิดข้อผิดพลาดในการโหลดสินค้า</div>';
            updateSummary(0);
        });
}

function renderCart(items) {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';

    if (!items || items.length === 0) {
        cartList.innerHTML = '<div class="cart-empty">ยังไม่มีสินค้าในรถเข็น</div>';
        updateSummary(0);
        return;
    }

    let total = 0;

    items.forEach(item => {
        const wrapper = document.createElement('div');
        wrapper.className = 'cart-item';

        // รูป
        const img = document.createElement('img');
        img.src = '../img/Book_Img/' + item.Book_Img;
        img.className = 'book-img';
        img.style.cursor = 'pointer';
        img.addEventListener('click', () => openQuickView(item));
        wrapper.appendChild(img);

        // ชื่อ
        const nameDiv = document.createElement('div');
        nameDiv.className = 'cart-item-name';
        nameDiv.innerText = item.Book_Name;
        wrapper.appendChild(nameDiv);

        // จำนวน
        const qtyDiv = document.createElement('div');
        qtyDiv.className = 'cart-item-quantity';
        qtyDiv.innerText = 'จำนวน: ' + item.Book_Total + ' เล่ม';
        wrapper.appendChild(qtyDiv);

        // ราคา
        const priceDiv = document.createElement('div');
        priceDiv.className = 'cart-item-price';
        priceDiv.innerText = item.Unit_Price.toFixed(2) + ' บาท';
        total += item.Unit_Price;
        wrapper.appendChild(priceDiv);

        // ปุ่มลบ
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-item-btn';
        removeBtn.innerText = 'ลบ';
        removeBtn.addEventListener('click', () => {
            fetch('/removeFromOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ Book_ID: item.Book_ID })
            })
            .then(() => loadCart())  // โหลดใหม่หลังลบ
            .catch(err => console.error('ลบสินค้าไม่สำเร็จ:', err));
        });
        wrapper.appendChild(removeBtn);

        cartList.appendChild(wrapper);
    });

    updateSummary(total);
}

function updateSummary(total) {
    document.getElementById('total-price').innerText = total.toFixed(2);
    document.getElementById('shipping-fee').innerText = (total * 0.05).toFixed(2);
    document.getElementById('tax-amount').innerText = (total * 0.07).toFixed(2);
    document.getElementById('discount-amount').innerText = '0.00';
    document.getElementById('payment-date').innerText = new Date().toLocaleDateString();
}

// เรียกโหลดเมื่อ DOM โหลดเสร็จ
window.addEventListener('DOMContentLoaded', () => loadCart());
