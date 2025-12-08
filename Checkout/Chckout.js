function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
function checkLogin() {
    const userName = getCookie("name");
    const imgg = getCookie("img");

    const loginBtn = document.getElementById("login");
    const unameLink = document.getElementById("Uname");
    const imgnow = document.getElementById("profile");

    if (userName || imgg) {
         if(loginBtn) {
            loginBtn.innerText = "LOGOUT";
            loginBtn.onclick = async (e) => {
                e.preventDefault();
                try {
                    const response = await fetch('/logout', { method: 'POST', credentials: 'same-origin' });
                    if(response.ok) {
                        document.cookie = "name=; max-age=0; path=/";
                        document.cookie = "Seller_ID=; max-age=0; path=/";
                        location.reload();
                    }
                } catch(err) {
                    console.error('Logout failed', err);
                }
            }
        }

        if(unameLink && userName) unameLink.innerText = userName;
        imgnow.src = '../img/Profile_Img/' + imgg;
    } 
    
    else {
        if(loginBtn) {
            loginBtn.innerText = "LOGIN/REGISTER";
            loginBtn.onclick = () => {
                location.href = "../Login/login.html";
            }
        }
        if(unameLink) unameLink.innerText = "";
    }
}

document.addEventListener("DOMContentLoaded", checkLogin);

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


// --- สร้าง wrapper สำหรับปุ่มลบ + input ---
const removeWrapper = document.createElement('div');
removeWrapper.className = 'remove-wrapper';

// input ใส่จำนวนที่ต้องการลบ
const inputQty = document.createElement('input');
inputQty.type = 'number';
inputQty.min = 1;
inputQty.max = item.Book_Total;
inputQty.value = 1;
inputQty.style.width = '50px';
inputQty.style.marginRight = '5px';

// ปุ่มลบ
const removeBtn = document.createElement('button');
removeBtn.className = 'remove-item-btn';
removeBtn.innerText = 'ลบ';
removeBtn.addEventListener('click', () => {
    const removeQty = parseInt(inputQty.value);
    if (removeQty > 0 && removeQty <= item.Book_Total) {
        fetch('/removeFromOrder', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({ Book_ID: item.Book_ID, Quantity: removeQty })
        })
        .then(() => loadCart())  // โหลดใหม่หลังลบ
        .catch(err => console.error('ลบสินค้าไม่สำเร็จ:', err));
    } else {
        alert('จำนวนที่ลบไม่ถูกต้อง');
    }
});

// รวม input + ปุ่มเข้าด้วยกัน
removeWrapper.appendChild(inputQty);
removeWrapper.appendChild(removeBtn);
wrapper.appendChild(removeWrapper);
        cartList.appendChild(wrapper);
    });

    updateSummary(total);
}

function updateSummary(total) {
    document.getElementById('total-price').innerText = total.toFixed(2);
    document.getElementById('shipping-fee').innerText = (50).toFixed(2);
    document.getElementById('tax-amount').innerText = (total * 0.07).toFixed(2);
    document.getElementById('discount-amount').innerText = '0.00';
    document.getElementById('payment-date').innerText = new Date().toLocaleDateString();
}

// เรียกโหลดเมื่อ DOM โหลดเสร็จ
window.addEventListener('DOMContentLoaded', () => loadCart());


document.getElementById('btnPay').addEventListener('click', async () => {
    try {
        const confirmPay = confirm("คุณแน่ใจว่าจะชำระเงินใช่หรือไม่?");
        if (!confirmPay) return;

        const res = await fetch('/Checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin'
        });

        if (!res.ok) {
            const text = await res.text();
            alert("เกิดข้อผิดพลาด: " + text);
            return;
        }

        alert("ชำระเงินเรียบร้อย! สร้าง Order ใหม่แล้ว");
        loadCart(); // โหลด cart ใหม่ ให้ว่าง
    } catch (err) {
        console.error("Pay Error:", err);
        alert("เกิดข้อผิดพลาด: " + err.message);
    }
});