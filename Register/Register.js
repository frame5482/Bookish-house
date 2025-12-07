
document.addEventListener('DOMContentLoaded', function() {
    const registerLink = document.getElementById('go-login');
    
    if (registerLink) {
        registerLink.addEventListener('click', function(event) {
            event.preventDefault(); 
            window.location.href = '../Login/login.html'; 
        });
    } else {
        console.error("");
    }
});

