// ตรวจสอบ Cookie ก่อนเริ่มโหลดหน้า (Code เดิมของท่าน)
function checkCookie(){
    if(getCookie("Seller_ID") == false && getCookie("User_Name") == false){
        // ถ้าไม่มีทั้ง seller_id และ User_Name ให้เด้งไปหน้า login
        // window.location = "login.html"; // เปิดบรรทัดนี้เมื่อท่านพร้อมใช้งานจริง
    }
}
checkCookie();

document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. ส่วนจัดการแสดงผลรูปภาพ (Image Preview) ---
    const imgInput = document.getElementById('product-image-input');
    const btnUpload = document.getElementById('btnUploadImage');
    const previewContainer = document.getElementById('imagePreview');

    if(btnUpload) {
        btnUpload.addEventListener('click', () => {
            imgInput.click();
        });
    }

    if(imgInput) {
        imgInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewContainer.innerHTML = ''; 
                    const img = document.createElement('img');
                    img.className = 'preview-image';
                    img.src = e.target.result; 
                    // ใส่ Style ให้รูปสวยงาม
                    img.style.width = "100%";
                    img.style.height = "100%";
                    img.style.objectFit = "cover";
                    previewContainer.appendChild(img);  
                }
                reader.readAsDataURL(file);
            }
        });
    }


    // --- 2. ส่วนส่งข้อมูล (Submit Form) ---
    // จับที่ <form id="addBookForm"> ไม่ใช่จับที่ปุ่ม!
    const form = document.getElementById('addBookForm');

    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // ห้ามรีเฟรชหน้า
            
            const formData = new FormData();

            // ตรวจสอบรูปภาพ
            const fileFile = document.getElementById('product-image-input').files[0];
            if (fileFile) {
                formData.append('book_img', fileFile); 
            } else {
                alert("กรุณาเลือกรูปภาพหน้าปกด้วยขอรับ!");
                return;
            }

            // เก็บข้อมูลจาก Input
            formData.append('name', document.getElementById('book-title').value);
            formData.append('price', document.getElementById('book-price').value);
            formData.append('detail', document.getElementById('book-description').value);

            // ⚠️ แก้ไขจุดที่ท่านสลับกัน (ตอนนี้ตรงแล้วขอรับ)
            // book-category คือ Dropdown -> ส่งเข้า category
            formData.append('category', document.getElementById('book-category').value);
            
            // book-tag คือ Input Text -> ส่งเข้า tag
            formData.append('tag', document.getElementById('book-tag').value);

            // หา Seller ID
            const sellerID = getCookie('Seller_ID') || getCookie('User_Name') || 'SE99999';
            formData.append('Seller_ID', sellerID);

            try {
                const response = await fetch('/addBook', {
                    method: 'POST',
                    body: formData 
                });

                const result = await response.json();

                if (response.ok) {
                    alert(`สำเร็จ! คัมภีร์หมายเลข ${result.bookID} ถูกจารึกแล้ว`);
                    window.location.href = 'feed.html'; 
                } else {
                    alert(`ล้มเหลว: ${result.message || 'เกิดข้อผิดพลาดบางอย่าง'}`);
                }

            } catch (error) {
                console.error('Error:', error);
                alert('เกิดวิบัติภัยในการเชื่อมต่อ Server!');
            }
        });
    }
});

// ฟังก์ชันดึง Cookie (ใช้ตัวเดียวพอขอรับ อันเก่าท่านมี 2 อันตีกันมั่ว)
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return false;
}