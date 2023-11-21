const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');  // Import the path module

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'https://test-server-fe.onrender.com',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Serve static files from the 'build' directory
app.use(express.static(path.join(__dirname, 'build')));

app.get('/api/message', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// Catch-all route to serve the 'index.html' file
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
