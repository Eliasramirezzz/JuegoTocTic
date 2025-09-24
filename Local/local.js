// ====================== Variables y Constantes =========================
let tiempoPorTurno = 10; // Tiempo por turno en segundos
let tiempoRestante = tiempoPorTurno;
let cronometroInterval;

let jugador1 = "";
let jugador2 = "";
let turno = "azul";
let botonOrigen = null;
let historialMovimientos = [];

const botones = Array.from(
    document.querySelectorAll("#btn1, #btn2, #btn3, #btn4, #btn5, #btn6, #btn7, #btn8, #btn9, #btn10")
);
const indicadorTurno = document.getElementById("indicador-turno");
const botonDeshacer = document.getElementById("deshacer");
const botonRedistribuir = document.getElementById("redistribuir");

const conexiones = {
    btn1: ["btn2", "btn8"],
    btn2: ["btn1", "btn3", "btn5", "btn9"],
    btn3: ["btn2", "btn10"],
    btn4: ["btn5"],
    btn5: ["btn2", "btn4", "btn6"],
    btn6: ["btn5", "btn7", "btn9"],
    btn7: ["btn6"],
    btn8: ["btn1", "btn5", "btn7", "btn9", "btn10"],
    btn9: ["btn2", "btn6", "btn8", "btn10"],
    btn10: ["btn3", "btn9"],
};

// ========================= Funciones Principales ========================
function iniciarJuego() {
    jugador1 = prompt("Ingrese el nombre del Jugador 1 (azul):", "Jugador 1");
    jugador2 = prompt("Ingrese el nombre del Jugador 2 (rojo):", "Jugador 2");
    historialMovimientos = [];
    distribuirBotones();
    actualizarColores();
    actualizarIndicadorTurno();
    iniciarCronometro();
}

function actualizarIndicadorTurno() {
    const jugador = turno === "azul" ? jugador1 : jugador2;
    indicadorTurno.textContent = `Turno de: ${jugador} (${turno})`;
}

function verificarGanador() {
    const areaRoja = [botones[0], botones[1], botones[2]]; // Área superior
    const areaAzul = [botones[7], botones[8], botones[9]]; // Área inferior

    if (areaAzul.every((b) => b.classList.contains("rojo"))) return true;
    if (areaRoja.every((b) => b.classList.contains("azul"))) return true;
    return false;
}

function reiniciarJuego() {
    botones.forEach((boton) => (boton.className = ""));
    iniciarJuego();
}

// ========================== Cronómetro ==============================
function iniciarCronometro() {
    detenerCronometro();
    actualizarCronometro();
    cronometroInterval = setInterval(() => {
        tiempoRestante--;
        actualizarCronometro();
        if (tiempoRestante <= 0) cambiarTurno();
    }, 1000);
}

function detenerCronometro() {
    clearInterval(cronometroInterval);
}

function reiniciarCronometro() {
    detenerCronometro();
    tiempoRestante = tiempoPorTurno;
    iniciarCronometro();
}

function actualizarCronometro() {
    const cronometroDisplay = document.getElementById("cronometro");
    cronometroDisplay.textContent = `Tiempo: ${tiempoRestante} seg`;
}

function cambiarTurno() {
    turno = turno === "azul" ? "rojo" : "azul";
    botonOrigen = null;
    actualizarIndicadorTurno();
    reiniciarCronometro();
}

// ====================== Funciones de los botones ====================
function distribuirBotones() {
    botones.forEach((boton) => (boton.className = ""));
    const indices = [...Array(botones.length).keys()].sort(() => Math.random() - 0.5);
    indices.slice(0, 3).forEach((i) => botones[i].classList.add("azul"));
    indices.slice(3, 6).forEach((i) => botones[i].classList.add("rojo"));
    actualizarColores();
}

function actualizarColores() {
    botones.forEach((boton) => {
        boton.style.backgroundColor = boton.classList.contains("azul")
            ? "blue"
            : boton.classList.contains("rojo")
            ? "red"
            : "white";
        boton.style.color = boton.classList.contains("azul") || boton.classList.contains("rojo") ? "white" : "black";
        boton.style.border = boton.classList.contains("seleccionado") ? "3px solid yellow" : "none";
    });
}

botones.forEach((boton) =>
    boton.addEventListener("click", () => manejarMovimiento(boton))
);

function manejarMovimiento(boton) {
    if (!botonOrigen) {
        if (boton.classList.contains(turno)) {
            botonOrigen = boton;
            boton.classList.add("seleccionado");
        } else {
            alert(`Debes seleccionar uno de tus botones (${turno}).`);
        }
    } else {
        if (boton === botonOrigen) {
            botonOrigen.classList.remove("seleccionado");
            botonOrigen = null;
        } else if (boton.classList.contains("azul") || boton.classList.contains("rojo")) {
            alert("El lugar está ocupado. Selecciona un lugar libre.");
        } else if (conexiones[botonOrigen.id]?.includes(boton.id)) {
            botonOrigen.classList.remove(turno, "seleccionado");
            boton.classList.add(turno);
            historialMovimientos.push({ origen: botonOrigen, destino: boton, turnoActual: turno });
            if (verificarGanador()) showWinner(turno === "azul" ? jugador1 : jugador2);
            else {
                turno = turno === "azul" ? "rojo" : "azul";
                botonOrigen = null;
                actualizarColores();
                actualizarIndicadorTurno();
                reiniciarCronometro();
            }
        } else {
            alert("Movimiento no permitido.");
        }
    }
}

botonDeshacer.addEventListener("click", () => {
    if (historialMovimientos.length) {
        const { origen, destino, turnoActual } = historialMovimientos.pop();
        origen.classList.add(turnoActual);
        destino.classList.remove(turnoActual);
        turno = turnoActual;
        actualizarColores();
        actualizarIndicadorTurno();
    } else alert("No hay movimientos para deshacer.");
});

botonRedistribuir.addEventListener("click", () => {
    distribuirBotones();
    botonOrigen = null;
    actualizarColores();
    actualizarIndicadorTurno();
});

// ========================= Modal Ganador ===========================
function showWinner(name) {
    const modal = document.getElementById("modal");
    const winnerNameElement = document.getElementById("winner-name");

    // Actualizar el nombre del ganador en el modal
    winnerNameElement.textContent = name;

    // Mostrar el modal cambiando el estilo display
    modal.style.display = "flex";

    // Crear partículas
    createParticles();
}

function closeModal() {
    const modal = document.getElementById("modal");

    // Ocultar el modal cambiando el estilo display
    modal.style.display = "none";

    // Eliminar partículas
    document.querySelectorAll(".particle").forEach((particle) => particle.remove());
}

function closeModalAndReload() { //Cierra el modal y reincia el juego
    const modal = document.getElementById("modal");

    // Ocultar el modal (opcional si quieres que desaparezca antes de recargar)
    modal.style.display = "none";

    // Recargar la página desde cero
    location.reload();
}

function createParticles() {
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";

        // Agregar al cuerpo del documento
        document.body.appendChild(particle);

        // Estilo y animación aleatoria para cada partícula
        particle.style.animationDuration = `${Math.random() * 2 + 3}s`;
        particle.style.position = "absolute";
        if (Math.random() > 0.5) {
            particle.style.top = "0";
            particle.style.left = `${Math.random() * 100}vw`;
        } else {
            particle.style.left = "0";
            particle.style.top = `${Math.random() * 100}vh`;
        }
    }
}

// Agregar eventos al botón de cierre
document.addEventListener("DOMContentLoaded", () => {
    const closeModalButton = document.getElementById("close-modal");
    if (closeModalButton) {
        closeModalButton.addEventListener("click", closeModalAndReload);
    }


});


document.addEventListener("DOMContentLoaded", iniciarJuego);
