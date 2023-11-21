// server.js
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://test-server-fe.onrender.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(bodyParser.json());

let serverMessage = 'Hello from the server!';

app.get('/api/message', (req, res) => {
  res.json({ message: serverMessage });
});

app.post('/api/message', (req, res) => {
  const { message } = req.body;
  serverMessage = message;
  res.json({ message: serverMessage });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
