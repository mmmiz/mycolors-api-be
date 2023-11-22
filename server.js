require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const Authenticate = require('./router/Authenticate');
const allColorRoute = require('./router/allColorRoute');


// ---------- 
mongoose.connect(process.env.MONGO_DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log("DB Connected");
});

app.use(cors({
  origin: 'https://mycolors-app.onrender.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(bodyParser.json());

app.use('/auth', authenticate);
app.use('/all', allColorRoute);


let serverMessage = 'Hello from the server!';
app.get('/api/message', (req, res) => {
  res.json({ message: serverMessage });
});

app.post('/api/message', (req, res) => {
  const { message } = req.body;
  serverMessage = message;
  res.json({ message: serverMessage });
});

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve the 'index.html' file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});


