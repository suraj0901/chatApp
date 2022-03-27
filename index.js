import express from 'express';
import http from 'http';
import { resolve } from 'path';
import { add, get } from './util/database.js';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = 3000;

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sendAllMessages = async () => {
  const [success, error] = await get();
  if (error) console.log(error);
  else {
    io.emit('allPrevMessage', success);
  }
};

const addMessage = async (msg) => {
  const [success, error] = await add(req.body);
  if (error) console.log(error);
  else {
    io.emit('newMessage', msg);
  }
};

io.on('connection', async (socket) => {
  await sendAllMessages();
  socket.on('message', addMessage);
});

app.get('/', (req, res) => {
  const { name, password } = req.body;
  res.sendFile(resolve('pages/index.html'));
});

app.post('/auth', async (req, res) => {
  const { name, password } = req.body;
  const user = await users.find(name, password);
  if (user) {
    res.body.token = req.body;
    res.redirect('/');
  } else res.send('Worng password');
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
