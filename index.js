const { ipcRenderer } = require('electron');
document.getElementById('entrar').onclick = () => {
  const usuario = document.getElementById('usuario').value;
  if (usuario) {
    ipcRenderer.send('entrar-usuario', usuario);
  }
};