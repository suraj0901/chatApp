import { createServer } from 'http';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import io_init from './lib/socket.js';

const port = 3000;
const server = createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const file = readFileSync(resolve('pages/index.html'));
    res.write(file);
    res.end();
  }
});

io_init(server);

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
