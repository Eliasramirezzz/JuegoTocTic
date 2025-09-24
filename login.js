const form = document.getElementById("login-form");

form.addEventListener("submit", (event) => {
    event.preventDefault();
    
    const username = document.getElementById("username").value.trim();
    if (username) {
        localStorage.setItem("username", username); // Guardar el nombre localmente
        window.location.href = "main.html"; // Redirigir a la pantalla principal
    } else {
        alert("Por favor, ingresa un nombre válido.");
    }
});



