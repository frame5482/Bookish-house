let bookData = [];

fetch('../Bookstock.json')
  .then(res => res.json())
  .then(data => {
    bookData = data;
    renderBooks(bookData);
  })
  .catch(err => console.error('โหลด JSON ล้มเหลว:', err));


function renderBooks(data) {
    const containers = {
        'Manga': document.getElementById('manga-container'),
        'Novel': document.getElementById('novel-container'),
        'Philo': document.getElementById('Philosophy-container'),
        'Monk':  document.getElementById('Buddhist-container'),
        'Famous': document.getElementById('famous-container') 
    };

    // ล้างของเก่า
    for (const key in containers) {
        if (containers[key]) containers[key].innerHTML = '';
    }
    data.forEach(book => {
        // เช็คว่าหนังสือเล่มนี้ควรอยู่กล่องไหน (ถ้าไม่มี Category ให้ลง Famous หรือจะแก้ Logic ตรงนี้ตามใจท่าน)
        const targetContainer = containers[book.Category] || containers['Famous'];
        
        if (targetContainer) {
            const itemWrapper = document.createElement('div');
            itemWrapper.className = 'book-item'; // ใช้ class ตามที่ท่านต้องการ

            // --- ส่วนรูปภาพ ---
            const img = document.createElement('img');
            img.className = 'book-img';
            img.src = '../img/Book_Img/' + book.Book_Img; // ตรวจสอบ path รูปให้ดีนะขอรับ
            img.alt = book.Book_Name;
            
            // *** จุดเชื่อมต่อ Quick View ***
            img.style.cursor = 'pointer'; // เปลี่ยนเมาส์เป็นรูปมือ
            img.addEventListener('click', () => {
                openQuickView(book); // เรียกฟังก์ชันเปิดหน้าต่าง
            });
            
            itemWrapper.appendChild(img);

            // --- ส่วนชื่อ ---
            const nameDiv = document.createElement('div');
            nameDiv.className = 'book-name';
            nameDiv.innerText = book.Book_Name;
            itemWrapper.appendChild(nameDiv);

            // --- ส่วนราคา ---
            const priceDiv = document.createElement('div');
            priceDiv.className = 'book-price';
            priceDiv.innerText = parseFloat(book.Book_Price).toFixed(2) + ' บาท';
            itemWrapper.appendChild(priceDiv);

            // --- ปุ่มเพิ่มลงตะกร้า (หน้ารวม) ---
            const btn = document.createElement('input');
            btn.className = 'add-basket';
            btn.type = 'button';
            btn.value = 'เพิ่มลงในรถเข็น';
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // กันไม่ให้กดปุ่มแล้ว QuickView เด้ง (เผื่อปุ่มทับรูป)
                alert(`ท่านได้หยิบ "${book.Book_Name}" ใส่รถเข็นแล้ว!`);
            });
            itemWrapper.appendChild(btn);

            targetContainer.appendChild(itemWrapper);
        }
    });
}




// =========================================
// 3. ส่วนจัดการ Quick View (Popup)
// =========================================
const quickViewModal = document.getElementById('quickview-container');
const overlay = document.getElementById('overlay'); // ใช้ Overlay ตัวเดียวกับเมนูข้าง
const closeBtn = document.getElementById('quickview-close');

// ตัวแปรภายใน Quick View
const qvImg = document.querySelector('.quickview-img');
const qvTitle = document.getElementById('quickview-title');
const qvPrice = document.getElementById('quickview-price');
const qvDetail = document.getElementById('quickview-detail');
const qvQuantityDisplay = document.getElementById('add-quantity');
let currentQuantity = 1;


// ฟังก์ชันเปิด Quick View
function openQuickView(book) {
    if (!quickViewModal) return;

    // อัปเดตข้อมูลข้างใน
    qvTitle.innerText = book.Book_Name;
    qvPrice.innerText = parseFloat(book.Book_Price).toFixed(2) + ' บาท';
    qvImg.src = '../img/Book_Img/' + book.Book_Img;
    
    // ใส่รายละเอียด (ถ้าใน JSON ไม่มี key นี้ ข้าใส่ข้อความ default ให้)
    qvDetail.innerText = book.Description || "รายละเอียดเพิ่มเติมของหนังสือเล่มนี้ กำลังรอการบันทึกจากบรรณารักษ์...";

    // รีเซ็ตจำนวน
    currentQuantity = 1;
    if(qvQuantityDisplay) qvQuantityDisplay.innerText = 'x' + currentQuantity;

    // แสดงผล
    quickViewModal.style.display = 'flex'; 
    if(overlay) overlay.style.display = 'block';
    
    // บังคับให้ container ของ overlay แสดงด้วย (ตาม HTML ท่านมี wrapper อีกชั้น)
    const overlayWrapper = document.querySelector('.overlay-container');
    if(overlayWrapper) overlayWrapper.style.display = 'block';
}

// ฟังก์ชันปิด Quick View
function closeQuickView() {
    if(quickViewModal) quickViewModal.style.display = 'none';
    if(overlay) overlay.style.display = 'none';
    
    const overlayWrapper = document.querySelector('.overlay-container');
    if(overlayWrapper) overlayWrapper.style.display = 'none';
}

// Event ปิดหน้าต่าง
if (closeBtn) closeBtn.addEventListener('click', closeQuickView);
if (overlay) overlay.addEventListener('click', closeQuickView);

// Logic ปุ่มบวกลบจำนวน (+/-)
const addButtons = document.querySelectorAll('.add-button');
if (addButtons.length >= 2) {
    // ปุ่มลบ (-) ตัวที่ 1
    addButtons[0].addEventListener('click', () => {
        if (currentQuantity > 1) {
            currentQuantity--;
            qvQuantityDisplay.innerText = 'x' + currentQuantity;
        }
    });
    // ปุ่มบวก (+) ตัวที่ 2
    addButtons[1].addEventListener('click', () => {
        currentQuantity++;
        qvQuantityDisplay.innerText = 'x' + currentQuantity;
    });
}

// ปุ่มสั่งซื้อใน Quick View
const qvBuyBtn = document.querySelector('.quickview-button');
if(qvBuyBtn) {
    qvBuyBtn.addEventListener('click', () => {
        alert(`สั่งซื้อ "${qvTitle.innerText}" จำนวน ${currentQuantity} เล่ม เรียบร้อยแล้วขอรับ!`);
        closeQuickView();
    });
}


// =========================================
// 4. ส่วน Slider Setup (ปุ่มกดเลื่อน)
// =========================================
function setupSlider(containerId, prevBtnClass, nextBtnClass, scrollAmount = 300) {
    const container = document.getElementById(containerId);
    // ค้นหาปุ่มโดยเริ่มหาจาก parent ของ container เพื่อให้ปุ่มอยู่ใกล้ตัว slider นั้นๆ
    // (หรือจะ querySelector document ก็ได้ถ้าชื่อ class ไม่ซ้ำ)
    const btnPrev = document.querySelector('.' + prevBtnClass); 
    const btnNext = document.querySelector('.' + nextBtnClass);

    if (!container || !btnPrev || !btnNext) return;

    btnPrev.addEventListener('click', () => {
        container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    btnNext.addEventListener('click', () => {
        container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
}

// เรียกใช้งาน Slider
setupSlider('manga-container', 'prev-manga', 'next-manga');
setupSlider('novel-container', 'prev-novel', 'next-novel');
setupSlider('Philosophy-container', 'prev-philo', 'next-philo');
setupSlider('Buddhist-container', 'prev-buddhist', 'next-buddhist');
setupSlider('famous-container', 'prev-famous', 'next-famous');






// 5. ส่วน Drag to Scroll (ลากเมาส์เพื่อเลื่อน)
document.querySelectorAll('.book, .book-slide > div').forEach(slider => { 
    
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing'; // เปลี่ยนเมาส์ตอนลาก
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
        e.preventDefault();
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; 
        slider.scrollLeft = scrollLeft - walk;
    });
});





const sideMenuWrapper = document.querySelector('.overlay-container');
const bgOverlay = document.getElementById('overlay');
const tabBtn = document.getElementById('tab-search');

// เปิดเมนู
function openSideMenu() {
    if (sideMenuWrapper) sideMenuWrapper.style.display = 'block';
    if (bgOverlay) bgOverlay.style.display = 'block';
}

// ปิดเมนู
function closeSideMenu() {
    if (sideMenuWrapper) sideMenuWrapper.style.display = 'none';
    if (bgOverlay) bgOverlay.style.display = 'none';
}

// ผูกปุ่ม
if (tabBtn) tabBtn.addEventListener('click', openSideMenu);
if (bgOverlay) bgOverlay.addEventListener('click', closeSideMenu);