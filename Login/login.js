
document.addEventListener('DOMContentLoaded', function() {
    const registerLink = document.getElementById('go-register');
    
    if (registerLink) {
        registerLink.addEventListener('click', function(event) {
            event.preventDefault(); 
            window.location.href = '../Register/Register.html'; 
        });
    } else {
        console.error("");
    }
});

