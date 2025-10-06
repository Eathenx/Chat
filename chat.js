const { ipcRenderer } = require('electron');
const io = require("socket.io-client");
let usuarioActual = "";

const socket = io("http://localhost:3000");

ipcRenderer.on('mostrar-usuario', (event, usuario) => {
  usuarioActual = usuario;
  document.getElementById('usuario').innerText = usuarioActual;
});

socket.on("historial-mensajes", (mensajes) => {
  const chatHistory = document.getElementById('chat-history');
  chatHistory.innerHTML = "";
  mensajes.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = `<strong>${msg.User || 'Sin usuario'}:</strong> ${msg.mensaje || ''} `;
    chatHistory.appendChild(msgDiv);
  });
});

document.getElementById('enviar')?.addEventListener('click', () => {
  const mensaje = document.getElementById('mensaje').value;
  if (mensaje.trim() !== "") {
    socket.emit("enviar-mensaje", { user: usuarioActual, mensaje });
    document.getElementById('mensaje').value = "";
  }
});