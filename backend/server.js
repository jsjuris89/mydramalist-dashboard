const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.json());
const db = new sqlite3.Database('./reviews.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the SQlite database.');
});
// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS reviews (
  dramaName TEXT NOT NULL,
  reviewer TEXT NOT NULL,
  score INTEGER,
  myNotes TEXT,
  PRIMARY KEY (dramaName, reviewer)
)`);

const tempReviewers = []

// ROUTES
app.post('/api/userreviews', (req, res) => {
  console.log('REQ.BODY --->', req.body);
  const dramaNameKey = req.body.dramaName.replace(/\s+/g, '_');

  // ADD SCORE
  if (Array.isArray(req.body.reviews)) {
    const stmt = db.prepare(`INSERT INTO reviews (dramaName, reviewer, score) 
                             VALUES (?, ?, ?) 
                             ON CONFLICT(dramaName, reviewer) 
                             DO UPDATE SET score=excluded.score`);
    req.body.reviews.forEach(newReview => {
      stmt.run(dramaNameKey, newReview.reviewer, newReview.score);
    });
    stmt.finalize();
  }

  // ADD COMMENT
  if (req.body.review && 'myNotes' in req.body.review) {
    console.log('Comment');
    const { reviewer, myNotes } = req.body.review;
    db.run(`UPDATE reviews SET myNotes = ? WHERE dramaName = ? AND reviewer = ?`,
      [myNotes, dramaNameKey, reviewer]);
  }
  res.sendStatus(200);
});


app.post('/api/hide', (req, res) => {
  console.log('/api/hide run');
  const { title } = req.body;
  const dramaNameKey = title.replace(/\s+/g, '_');

  db.all('SELECT reviewer FROM reviews WHERE dramaName = ?', [dramaNameKey], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const reviewersNamesOnly = rows.map(item => item.reviewer);
    console.log(reviewersNamesOnly);
    res.json(reviewersNamesOnly);
  });
});


app.post('/api/search', (req, res) => {
  console.log('api/search', req.body)
  // TODO this probably should send drama title too
  // const { drama } = req.body
  // const dramaNameKey = drama.replace(/\s+/g, '_');
  const { names } = req.body
  tempReviewers.push(...names)
})


app.get('/api/search', (req, res) => {
  console.log('checking', tempReviewers)
  const placeholders = tempReviewers.map(() => '?').join(',');

  const sql = `SELECT 
                  reviewer, 
                  SUM(score) AS total, 
                  GROUP_CONCAT(myNotes, ' | ') AS all_notes
              FROM reviews 
              WHERE reviewer IN (${placeholders}) 
              GROUP BY reviewer;`
  db.all(sql, tempReviewers, (err, rows) => {
    if (err) {
      console.log(err)
    }
    res.json(rows);
  })
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Close the database connection.');
    process.exit(0);
  });
});