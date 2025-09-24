let tiempoPorTurno = 30; // Tiempo por turno en segundos
let tiempoRestante = tiempoPorTurno;
let cronometroInterval;
let turno = "azul"; // Turno inicial
let jugador1 = "Jugador Azul";
let jugador2 = "Jugador Rojo";

// Elementos del DOM
const cronometroDisplay = document.getElementById("cronometro");
const indicadorTurno = document.getElementById("indicador-turno");

// Función para iniciar el cronómetro
function iniciarCronometro() {
    tiempoRestante = tiempoPorTurno; // Reiniciar el tiempo
    actualizarCronometro();
    cronometroInterval = setInterval(() => {
        tiempoRestante--;
        actualizarCronometro();

        if (tiempoRestante <= 0) {
            cambiarTurno();
        }
    }, 1000);
}

// Actualizar la visualización del cronómetro
function actualizarCronometro() {
    cronometroDisplay.textContent = `Tiempo: ${tiempoRestante}`;
}

// Cambiar el turno automáticamente
function cambiarTurno() {
    clearInterval(cronometroInterval); // Detener el cronómetro actual

    // Cambiar al otro jugador
    turno = turno === "azul" ? "rojo" : "azul";
    indicadorTurno.textContent = `Turno: ${turno === "azul" ? jugador1 : jugador2}`;

    iniciarCronometro(); // Iniciar el cronómetro del nuevo turno
}

// Iniciar el juego
function iniciarJuego() {
    jugador1 = prompt("Ingrese el nombre del Jugador Azul:", "Jugador Azul") || "Jugador Azul";
    jugador2 = prompt("Ingrese el nombre del Jugador Rojo:", "Jugador Rojo") || "Jugador Rojo";
    indicadorTurno.textContent = `Turno: ${jugador1}`;
    iniciarCronometro(); // Comenzar el cronómetro para el primer jugador
}

// Llamar a iniciarJuego al cargar la página
window.onload = iniciarJuego;
