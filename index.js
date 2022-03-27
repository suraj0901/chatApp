import express from 'express';
import { resolve } from 'path';
import { add, get } from './util/database.js';

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  console.log('hello world');
  res.sendFile(resolve('pages/index.html'));
});

app.get('/message', async (req, res) => {
  const [success, error] = await get();
  if (error) res.status(500);
  else res.send(success);
});

app.post('/message', async (req, res) => {
  console.log(req.body);
  const [success, error] = await add(req.body);
  if (error) res.status(500);
  else res.status(200);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
