function checkCookie(){
    if(getCookie("Seller_ID") == false && getCookie("User_Name") == false){
        // ถ้าไม่มีทั้ง seller_id และ User_Name ให้เด้งไปหน้า login
        // window.location = "login.html"; 
    }
}
checkCookie();


let bookData = [];
// แทนที่จะ fetch จากไฟล์ JSON
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
fetch('/getBooks')
  .then(res => res.json())
  .then(data => {
    const sellerId = getCookie("Seller_ID"); // อ่าน Seller_ID จาก cookie
    bookData = sellerId 
        ? data.filter(book => book.Seller_ID === sellerId) 
        : data; // ถ้าไม่มี cookie ก็เอาทุกเล่ม
    renderBooks(bookData);
  })
  .catch(err => console.error('โหลดข้อมูลจาก Server ล้มเหลว:', err));
  
 document.querySelectorAll('.tag-book').forEach(btn => {
    btn.addEventListener('click', () => {
        const selected = btn.dataset.category;   // เช่น "Manga"
        const filtered = bookData.filter(book => book.Book_Category === selected);
        renderBooks(filtered);
    });
});


function renderBooks(data) {
   const container = document.getElementById('Book-container');
    if(!container) return;
    container.innerHTML = '';

    data.forEach(book => {
        const targetContainer = container;
        
        if (targetContainer) {
            const itemWrapper = document.createElement('div');
            itemWrapper.className = 'book-item'; 

            // --- ส่วนรูปภาพ ---
            const img = document.createElement('img');
            img.className = 'book-img';
            img.src = '../img/Book_Img/' + book.Book_Img; 
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

            const QuantityDiv = document.createElement('div');
            QuantityDiv.className = 'book-quantity';
            QuantityDiv.innerText = "คงเหลือ: " + (book.Book_Quantity || "0") + " เล่ม";
            itemWrapper.appendChild(QuantityDiv);
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
const qvquantity = document.getElementById('quickview-quantity');
const qvQuantityDisplay = document.getElementById('add-quantity');
let currentQuantity = 1;

function openQuickView(book) {
    console.log("Opening Quick View for:", book);
    if (!quickViewModal) return;
   
    qvTitle.innerText = book.Book_Name;
    qvPrice.innerText = parseFloat(book.Book_Price).toFixed(2) + ' บาท';
    qvImg.src = '../img/Book_Img/' + book.Book_Img;
    
    qvDetail.innerText = book.Book_Detail || "รายละเอียดเพิ่มเติมของหนังสือเล่มนี้ กำลังรอการบันทึกจากบรรณารักษ์...";
    qvquantity.innerText = "คงเหลือ: " + (book.Book_Quantity || "ไม่ระบุ") + " เล่ม";
    currentQuantity = 1;
    if(qvQuantityDisplay) qvQuantityDisplay.innerText = 'x' + currentQuantity;

    quickViewModal.style.display = 'flex'; 
    if(overlay) overlay.style.display = 'block';
    
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




const sideMenuWrapper = document.querySelector('.overlay-container');
const bgOverlay = document.getElementById('overlay');
const bgsidemenu = document.getElementById('side-menu');
const tabBtn = document.getElementById('tab-search');

// เปิดเมนู
function openSideMenu() {
    if (sideMenuWrapper) sideMenuWrapper.style.display = 'block';
    if (bgOverlay) bgOverlay.style.display = 'block';
    if (bgsidemenu) bgsidemenu.style.display = 'block';
}

// ปิดเมนู
function closeSideMenu() {
    if (sideMenuWrapper) sideMenuWrapper.style.display = 'none';
    if (bgOverlay) bgOverlay.style.display = 'none';
    if (bgsidemenu) bgsidemenu.style.display = 'none';  
}

// ผูกปุ่ม
if (tabBtn) tabBtn.addEventListener('click', openSideMenu);
if (bgOverlay) bgOverlay.addEventListener('click', closeSideMenu);