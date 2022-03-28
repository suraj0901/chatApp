import express from 'express';
import http from 'http';
import { resolve } from 'path';
import { add, get, users } from './util/database.js';
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
  next();
});

const sendAllMessages = async () => {
  const [success, error] = await get();
  if (error) console.log(error);
  else {
    io.emit('allPrevMessage', success);
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
  await sendAllMessages();
  socket.on('message', addMessage);
});

app.get('/', async (req, res) => {
  res.sendFile(resolve('pages/index.html'));
});

app.get('/auth', async (req, res) => {
  const { name, password } = req.body;
  const token = users.find(req.body);
  if (token) res.json({ token });
  else res.send("Worng token don't try to hack dude");
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
