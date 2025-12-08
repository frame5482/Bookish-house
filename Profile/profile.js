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

window.onload = function() {
    checkLogin();

    const imgFileName = getCookie('img');
    if (imgFileName) {
        const profileImg = document.getElementById('profilepage');
        if (profileImg) {
            profileImg.src = `../img/Profile_Img/` +imgFileName;
        }
    }
};





function previewImage(event) {
    const input = event.target;
    const reader = new FileReader();

    reader.onload = function() {
        const output = document.getElementById('profilepage');
        output.src = reader.result;
    };

    if (input.files && input.files[0]) {
        reader.readAsDataURL(input.files[0]);
    }
}

async function updateProfile() {
    const usernameInput = document.getElementById('usernameInput');
    const emailInput = document.getElementById('emailInput');
    const dateInput = document.getElementById('dateInput');
    const addressInput = document.getElementById('addressInput');
    const avatarInput = document.getElementById('avatarInput');

    
    if (!usernameInput.value || !emailInput.value || !dateInput.value || !addressInput.value) {
        alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
        return;
    }

   
    const formData = new FormData();
    
    // key ด้านซ้าย ("username", "email"...) ต้องตรงกับที่ Server: const { username, email... } = req.body;
    formData.append('username', usernameInput.value);
    formData.append('email', emailInput.value);
    formData.append('date', dateInput.value);
    formData.append('address', addressInput.value);

    // key "avatar" ต้องตรงกับที่ Server: uploadprofile.single("avatar")
    if (avatarInput.files.length > 0) {
        formData.append('avatar', avatarInput.files[0]);
    }

    try {
        // --- C. ส่งข้อมูลไปที่ Server ---
        const response = await fetch('/Updateinfo', {
            method: 'POST',
            body: formData
            // ไม่ต้องใส่ Content-Type: multipart/form-data เพราะ fetch จะใส่ให้เองพร้อม boundary
        });

        // --- D. อ่านและแงะข้อความตอบกลับจาก Server ---
        // Server ของคุณส่งกลับมาเป็น HTML String ที่มี <script>alert(...)</script>
        // เราต้องดึงข้อความข้างในออกมาแสดงเอง เพราะ fetch ไม่รัน script ให้
        const responseText = await response.text();
        console.log("Server Response:", responseText); // ดูผลลัพธ์ดิบใน Console

        // 1. หาข้อความใน alert('...')
        const alertMatch = responseText.match(/alert\('(.+?)'\)/);
        if (alertMatch && alertMatch[1]) {
            alert(alertMatch[1]); // แสดง Popup แจ้งเตือนตามที่ Server บอก
        }

        // 2. หาคำสั่ง window.location = '...' (กรณีสำเร็จ)
        const redirectMatch = responseText.match(/window\.location\s*=\s*['"](.+?)['"]/);
        if (redirectMatch && redirectMatch[1]) {
            window.location.href = redirectMatch[1]; // ย้ายหน้าไปตามที่ Server สั่ง
        } 
        // 3. หาคำสั่ง history.back() (กรณี Error)
        else if (responseText.includes("window.history.back()")) {
            // ไม่ต้องทำอะไร หรืออาจจะแค่ log error เพราะเรา alert ไปแล้วข้างบน
            console.warn("Server requested history back due to error.");
        } 
        else {
            // กรณีอื่นๆ หรือถ้า Server ตอบกลับมาแปลกๆ ให้รีเฟรชหน้าเพื่อให้เห็นข้อมูลใหม่
            if (alertMatch && alertMatch[1].includes("เรียบร้อย")) {
                 window.location.reload();
            }
        }

    } catch (error) {
        console.error("Error:", error);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อกับ Server");
    }
}