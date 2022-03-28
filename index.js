import express from 'express';
import http from 'http';
import { resolve } from 'path';
import { authenticateUser, addMessage, getMessages } from './lib/util.js';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;
const session = {};

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    const username = session.get(token, false);
    if (!username) return next(new Error('User is unauthorised'));
    socket.token = token;
    socket.username = username;
    return next();
  }
  const token = authenticateUser(socket.handshake.auth);
  if (!token) return next(new Error('Wrong Crendentials'));
  session[token] = socket.handshake.auth.username;
  session.token = token;
  session.username = username;
  next();
});

io.on('connection', async (socket) => {
  await getMessages(socket);
  socket.emit('session', {
    token: socket.token,
    username: socket.username,
  });
  socket.on('message', addMessage);
  socket.on('disconnect', () => delete session[token]);
});

app.get('/', async (req, res) => {
  res.sendFile(resolve('pages/index.html'));
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
