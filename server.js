const { Server } = require("socket.io");
const http = require("http");
const admin = require("firebase-admin");

const serviceAccount = require("./firebase-key.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

const server = http.createServer();
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  db.collection('Data').orderBy('fecha').get().then(snapshot => {
    const mensajes = snapshot.docs.map(doc => doc.data());
    socket.emit("historial-mensajes", mensajes);
  });

  socket.on("enviar-mensaje", async (data) => {
    await db.collection('Data').add({
      User: data.user,
      mensaje: data.mensaje,
      fecha: new Date()
    });

    const snapshot = await db.collection('Data').orderBy('fecha').get();
    const mensajes = snapshot.docs.map(doc => doc.data());
    io.emit("historial-mensajes", mensajes);
  });
});

server.listen(3000, () => {
  console.log("Servidor socket escuchando en puerto 3000");
});