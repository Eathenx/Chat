const { app, BrowserWindow, ipcMain } = require('electron');

let mainWin;
let chatWin;
let user = null;

function createWindow() {
  mainWin = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  mainWin.loadFile('index.html');
  mainWin.setMenu(null);
}

app.whenReady().then(createWindow);

ipcMain.on('entrar-usuario', (event, usuario) => {
  user = usuario;

  chatWin = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  chatWin.loadFile('chat.html');
  chatWin.setMenu(null);
  chatWin.webContents.on('did-finish-load', () => {
    chatWin.webContents.send('mostrar-usuario', user);
  });

  mainWin.close();
});

app.on('window-all-closed', () => {
  app.quit();
});