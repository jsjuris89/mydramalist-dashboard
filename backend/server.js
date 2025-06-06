const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors()); // Allow requests from extension
app.use(express.json()); // Parse JSON body

let storedData = [];
let userReviews = [];

// POST endpoint for dataScraper.js
// app.post('/api/data', (req, res) => {
//   console.log('Received data from /api/data:', req.body);
//   storedData.push(req.body) // save data before we can send it to client
//   res.sendStatus(200);
// });

app.post('/api/userreviews', (req, res) => {
  req.body.forEach(newReview => {
    const dramaNameKey = newReview.dramaName.replace(/\s+/g, '_'); // Replace spaces with underscores
    // each item in userReviews array is an object that consists of single key that is just the drama name
    const existingDramaIndex = userReviews.findIndex(item => item.hasOwnProperty(dramaNameKey));
    // STEP 1: check if userReviews have drama object that has SINGLE key with dramaNameKey
    if (existingDramaIndex === -1) {
      // creating drama very first entry with 1st review
      // Happens ONCE!!
      const newDramaEntry = {
        [dramaNameKey]: [{
          reviewer: newReview.reviewer,
          score: newReview.score
        }]
      }
      userReviews.push(newDramaEntry)
      // STEP 1.5: key === dramaNameKey now we:
      // a) add new review
      // b) edit existing review
    } else {  
      console.log('elseeeeeee...')
      // CASE B: update an existing review object
      const existingReviewerIndex = userReviews[existingDramaIndex][dramaNameKey].findIndex(reviewerObj => reviewerObj.reviewer === newReview.reviewer)
      // console.log('elseee INDEX --->', existingReviewerIndex)
      // console.log('1 --->', userReviews);
      // console.log('2 --->', userReviews[existingDramaIndex]);
      // console.log('3 --->', userReviews[existingDramaIndex][dramaNameKey]);

      if (existingReviewerIndex >= 0) {
        console.log('EDIT REVIEW...')
        console.log('checking:', userReviews[existingDramaIndex][dramaNameKey][existingReviewerIndex])
        console.log('new value:', newReview)
        userReviews[existingDramaIndex][dramaNameKey][existingReviewerIndex].score = newReview.score
      }
      // CASE A: add a brand new review
      if (existingReviewerIndex === -1) {
        console.log('NEW REVIEW...')
        console.log('new reviewer obj:', newReview)
        userReviews[existingDramaIndex][dramaNameKey].push({
          reviewer: newReview.reviewer,
          score: newReview.score
        })
      }
    }

  });
  console.log('END userReviews[0]:', userReviews[0])
  console.log('END userReviews[1]:', userReviews[1])
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
