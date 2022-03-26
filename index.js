const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.resolve('pages/index.html'));
});

app.post('/postMessage', (req, res) => {
  const { message } = req.body;
  console.log(message);
  res.status(200);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
