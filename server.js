const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = require('http').createServer(app);
const os = require('os');

let servidores = []; // Lista de servidores disponibles

// Configuración de Socket.IO con CORS
const io = new Server(server, {
  cors: {
    origin: "*", // Permite conexiones desde cualquier dominio
    methods: ["GET", "POST"],
  },
});

// Manejo de conexiones de clientes
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado:', socket.id);

  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });

  // Aquí defines los eventos que esperas recibir del cliente
  socket.on('eventoEjemplo', (data) => {
    console.log('Datos recibidos del cliente:', data);
  });        
});

// Configuración para servir archivos estáticos
app.use(express.static(__dirname));
app.use('/1vs1', express.static(path.join(__dirname, '1vs1')));

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

// Conexión al socket
io.on("connection", (socket) => {
  console.log("Un usuario se ha conectado.");
  console.log(`Desde la IP: ${socket.handshake.address}`);

  // Guardar el nombre del usuario
  socket.on("set-name", (name) => {
    socket.username = name.trim();
    console.log(`Usuario conectado con el nombre: ${socket.username}`);
  });

  // Crear un servidor
  socket.on("create-server", (serverName) => {
    if (!serverName || serverName.trim() === "" || serverName.length > 20) {
      socket.emit("error-message", "El nombre del servidor no es válido.");
      return;
    }

    const server = { id: socket.id, name: serverName, players: [] };
    servidores.push(server);
    console.log(`Servidor creado: ${serverName}`);
    io.emit("servers-list", servidores); // Actualizar la lista de servidores para todos
  });

  // Solicitar unirse a un servidor
  socket.on("join-server", () => {
    if (servidores.length === 0) {
      socket.emit("no-servers", "No hay servidores disponibles en este momento.");
    } else {
      socket.emit("servers-list", servidores); // Enviar la lista de servidores disponibles
    }
  });

  // Manejar selección de un servidor para unirse
  socket.on("join-server-selected", (serverId) => {
    const server = servidores.find((s) => s.id === serverId);

    if (server) {
      // Verificar si el cliente ya está en el servidor
      if (server.players.find((player) => player.id === socket.id)) {
        socket.emit("error-message", "Ya estás en este servidor.");
        return;
      }

      // Verificar si el nombre ya existe en este servidor
      if (server.players.find((player) => player.name === socket.username)) {
        socket.emit("error-message", "El nombre ya existe en este servidor. Por favor, elige otro.");
        return;
    }

      // Agregar al jugador al servidor
      if (server.players.length < 2) {
        server.players.push({ id: socket.id, name: socket.username });

        // Actualizar lista de servidores en tiempo real
        io.emit("servers-list", servidores);

        if (server.players.length === 2) {
          console.log(`Servidor ${server.name} listo para comenzar.`);

          // Enviar evento de inicio a los jugadores
          server.players.forEach((player, index) => {
            io.to(player.id).emit("start-game", {
              role: index === 0 ? "Jugador 1 (Azul)" : "Jugador 2 (Rojo)",
              redirectUrl: "/1vs1/juego1vs1.html",
            });
          });

          console.log(`Roles asignados a jugadores del servidor ${server.name}.`);
          
        } else {
          // Esperar a otro jugador
          socket.emit("waiting", "Esperando a otro jugador...");
        }
      } else {
        socket.emit("server-full", "Este servidor ya tiene dos jugadores.");
      }
    } else {
      socket.emit("server-not-found", "Servidor no encontrado.");
    }
  });

  // Desconexión del usuario
  socket.on("disconnect", () => {
    servidores.forEach((server) => {
      server.players = server.players.filter((player) => player.id !== socket.id);
    });

    // Eliminar servidores sin jugadores
    servidores = servidores.filter((server) => server.players.length > 0);

    // Actualizar lista de servidores en tiempo real
    io.emit("servers-list", servidores);

    console.log("Un usuario se ha desconectado.");
  });
});

function obtenerIPLocal() {
  const interfaces = os.networkInterfaces();
  for (const nombreInterfaz in interfaces) {
      for (const direccion of interfaces[nombreInterfaz]) {
          if (direccion.family === 'IPv4' && !direccion.internal) {
              return direccion.address;
          }
      }
  }
  return 'localhost';
}

app.use((req, res, next) => {
  if (req.hostname === 'localhost') {
      const ipLocal = obtenerIPLocal();
      res.redirect(`http://${ipLocal}:3000`);
  } else {
      next();
  }
});

const ipLocal = obtenerIPLocal();

// Escuchar en el puerto 3000 con la IP local del Servidor
server.listen(3000, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://${ipLocal}:3000`);
});

