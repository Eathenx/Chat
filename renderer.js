const { ipcRenderer } = require('electron');

ipcRenderer.on('respuesta-servidor', (event, respuesta) => {
  document.getElementById('respuesta').innerText = respuesta;
});