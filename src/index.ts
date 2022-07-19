import 'dotenv/config';
import express from 'express';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const PORT = 3000;
const PUBLIC_FOLDER = path.join(__dirname, '..', 'public/');
const io = new Server(server);

app.use(express.static(PUBLIC_FOLDER));

app.get('/', (_req, res) => {
  res.sendFile(path.join(PUBLIC_FOLDER, 'index.html'));
});

io.on('connection', (socket) => {
  socket.broadcast.emit('newConnection', socket.id);

  socket.on('msg', (msg) => {
    socket.broadcast.emit('newMsg', { value: msg, sender: socket.id });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('disconnection', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
