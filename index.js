import express from 'express';
import { resolve } from 'path';
import { add, get } from './util/database.js';

const app = express();
const port = 3000;

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(resolve('pages/index.html'));
});

app.get('/message', (req, res) => {
  const [success, error] = get();
  if (error) res.status(500);
  else res.send(success);
});

app.post('/message', (req, res) => {
  const { message } = req.body;
  const [success, error] = add(message);
  if (error) res.status(500);
  else res.status(200);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
