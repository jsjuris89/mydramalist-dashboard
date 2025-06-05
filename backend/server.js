const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Allow requests from extension
app.use(express.json()); // Parse JSON body

let storedData = [];
let userReviews = [];

// POST endpoint to receive data
app.post('/api/data', (req, res) => {
  console.log('Received data from /api/data:', req.body);
  storedData.push(req.body) // save data before we can send it to client
  res.sendStatus(200);
});

app.post('/api/userreviews', (req, res) => {
  console.log('Received data from /api/userreviews:', req.body);
  
  // // Assuming req.body is an array of review objects
  // if (!Array.isArray(req.body)) {
  //   return res.status(400).send('Expected an array of reviews');
  // }
  // console.log('req.body:', req.body)

  req.body.forEach(newReview => {
    // Find index of existing review with the same name
    const existingIndex = userReviews.findIndex(
      review => review.name === newReview.name
    );

    if (existingIndex !== -1) {
      // Update existing review
      userReviews[existingIndex] = {
        ...userReviews[existingIndex],
        ...newReview
      };
    } else {
      // Add new review
      userReviews.push(newReview);
    }
  });

  console.log('Updated userReviews:', userReviews);
  res.sendStatus(200);
});

app.get('/api/data', (req, res) => {
  console.log('get /api/data run')
  res.json(storedData);  // send data to client
});

app.get('/api/userreviews', (req, res) => {
  console.log('get /api/userreviews run')
  res.json(userReviews)
})


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
