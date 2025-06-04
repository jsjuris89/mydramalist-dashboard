const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Allow requests from extension
app.use(express.json()); // Parse JSON body

let storedData = [];

// POST endpoint to receive data
app.post('/api/data', (req, res) => {
  console.log('Received data:', req.body);
  storedData.push(req.body) // save data before we can send it to client
  res.sendStatus(200);
});

app.get("/api/data", (req, res) => {
  res.json(storedData);  // send data to client
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
