// Explicacion de como se juega.
document.addEventListener('DOMContentLoaded', () => {
    // 1. Obtenemos las referencias a los elementos del DOM
    const openModalBtn = document.getElementById("openModalBtn");
    const modal = document.getElementById("gameModal");
    const closeBtn = document.querySelector(".modal-content .close");

    // 2. Definimos las funciones para abrir y cerrar el modal
    function openModal() {
        modal.style.display = "block";
        document.body.classList.add('no-scroll'); 
    }

    function closeModal() {
        modal.style.display = "none";
        document.body.classList.remove('no-scroll'); 
    }

    // 3. Asignamos los eventos de manera global (no anidados)
    // Evento para abrir el modal
    if (openModalBtn) {
        openModalBtn.addEventListener("click", openModal);
    }
    
    // Evento para cerrar el modal con el botón 'X'
    if (closeBtn) {
        closeBtn.addEventListener("click", closeModal);
    }

    // Evento para cerrar el modal haciendo clic fuera de él
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
    window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });
});