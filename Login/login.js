
document.addEventListener('DOMContentLoaded', function() {
    const registerLink = document.getElementById('go-register');
    
    if (registerLink) {
        registerLink.addEventListener('click', function(event) {
            event.preventDefault(); 
            // ย้อนกลับไป 1 โฟลเดอร์ (..) แล้วเข้า Register
            window.location.href = '../Register/Register.html'; 
        });
    } else {
        console.error("หาปุ่มไม่เจอขอรับนายท่าน!");
    }
});

