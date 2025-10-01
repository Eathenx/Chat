const { ipcRenderer } = require('electron');

let usuarioActual = "";

ipcRenderer.on('mostrar-usuario', (event, usuario) => {
  usuarioActual = usuario;
  document.getElementById('usuario').innerText = usuarioActual;
});

window.onload = () => {
  ipcRenderer.send('solicitar-historial');
};

ipcRenderer.on('historial-mensajes', (event, mensajes) => {
    const chatHistory = document.getElementById('chat-history');
    chatHistory.innerHTML = "";

    mensajes.forEach(msg => {
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = `<strong>${msg.User || 'Sin usuario'}:</strong> ${msg.mensaje || ''}`;
    chatHistory.appendChild(msgDiv);
    });
});

document.getElementById('enviar')?.addEventListener('click', () => {
    const mensaje = document.getElementById('mensaje').value;
    if (mensaje.trim() !== "") {
        ipcRenderer.send('enviar-mensaje', mensaje);
        document.getElementById('mensaje').value = "";
        setTimeout(() => ipcRenderer.send('solicitar-historial'), 500);
    }
});