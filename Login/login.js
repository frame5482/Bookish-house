
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

    const registerSellerLink = document.getElementById('go-registerSeller');
    
    if (registerSellerLink) {
        registerSellerLink.addEventListener('click', function(event) {
            event.preventDefault(); 
            window.location.href = '../Register/RegisterSeller.html'; 
        });
    } else {
        console.error("");
    }


});

