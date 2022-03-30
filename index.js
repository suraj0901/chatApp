import express from 'express';
import http from 'http';
import { resolve } from 'path';
import io_init from './lib/socket.js';

const app = express();
const server = http.createServer(app);
const port = 3000;

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io_init(server);

app.get('/', async (req, res) => {
  res.sendFile(resolve('pages/index.html'));
});

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
