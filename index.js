import express from 'express';
import http from 'http';
import { resolve } from 'path';
import { add, get, users, session } from './lib/database.js';
import { authenticateUser } from './lib/util.js';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    const username = session.get(token, false);
    if (!username) next(new Error('User is unauthorised'));
    socket.username = username;
    return next();
  }
  const token = authenticateUser(socket.handshake.auth);
  if (!token) return next(new Error('Wrong Crendentials'));
  next();
});

const sendAllMessages = async () => {
  const [success, error] = await get();
  if (error) console.log(error);
  else {
    socket.emit('allPrevMessage', success);
  }
};

const addMessage = async (msg) => {
  const [success, error] = await add(msg);
  if (error) {
    console.log(error);
  } else if (success) {
    io.emit('newMessage', msg);
  }
};

io.on('connection', async (socket) => {
  await sendAllMessages(socket);
  socket.on('message', addMessage);
  socket.on('disconnect', () => delete session[token]);
});

app.get('/', async (req, res) => {
  res.sendFile(resolve('pages/index.html'));
});

// app.get('/auth', async (req, res) => {
//   if (users.find(req.body)) res.json({ token });
//   res.send("Worng token don't try to hack dude");
// });

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
