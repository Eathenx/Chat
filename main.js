const { app, BrowserWindow, ipcMain } = require('electron');
const admin = require("firebase-admin");

let mainWin;
let chatWin;
let user = null;

const serviceAccount = require("./firebase-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

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

ipcMain.on('enviar-mensaje', async (event, mensaje) => {
  try {
    const docRef = await db.collection('Data').add({
      User: user,
      mensaje: mensaje,
      fecha: new Date()
    });
  } catch (error) {
    event.reply('respuesta-servidor', 'Error al guardar en Firebase: ' + error.message);
  }
});

ipcMain.on('solicitar-historial', async (event) => {
  const snapshot = await db.collection('Data').orderBy('fecha').get();
  const mensajes = snapshot.docs.map(doc => doc.data());
  event.sender.send('historial-mensajes', mensajes);
});

app.on('window-all-closed', () => {
  app.quit();
});