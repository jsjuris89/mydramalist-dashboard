const express = require('express');
const cors = require('cors');
const PORT = 3000;
const app = express();
app.use(cors()); // Allow requests from extension
app.use(express.json()); 

let userReviews = {};

app.post('/api/userreviews', (req, res) => {
  console.log('REQ.BODY --->', req.body)
  const dramaNameKey = req.body.dramaName.replace(/\s+/g, '_');
  userReviews[dramaNameKey] ??= []
  const dramaReviews = userReviews[dramaNameKey]

  // ADD SCORE
  if (Array.isArray(req.body.reviews)) {
    req.body.reviews.forEach(newReview => {
      const found = dramaReviews.find(item => item.reviewer === newReview.reviewer)
      // console.log('found', found)
      if (!found) {
        dramaReviews.push(newReview)
      } else {
        // only updating score that changed nothing else
        if (found.score !== newReview.score) {
          found.score = newReview.score
          console.log('Update', found)
          // console.log(dramaReviews)
        }
      }
    });
  }

  // ADD COMMENT
  if (req.body.review && 'myNotes' in req.body.review) {
    console.log('Comment')
    const found = dramaReviews.find(el => el.reviewer === req.body.review.reviewer)
    if (found) {
      found.myNotes = req.body.review.myNotes
      console.log('Update', dramaReviews.find(el => el.reviewer === req.body.review.reviewer))
    } 
  }
  res.sendStatus(200);
});


app.post('/api/hide', (req, res) => {
  console.log('/api/hide run')
  const { title } = req.body
  const dramaNameKey = title.replace(/\s+/g, '_')
  const reviewers = userReviews[dramaNameKey]
  // TODO: fix undefined map error
  const reviewersNamesOnly = reviewers.map(item => item.reviewer)
  console.log(reviewersNamesOnly)
  res.json(reviewersNamesOnly)
})


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
