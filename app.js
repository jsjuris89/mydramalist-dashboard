// depends on dataScraper.js in my extension which now is disabled
// fetch("http://localhost:3000/api/data")
//   .then(res => res.json())
//   .then(data => {
//     console.log("Received data from backend:", data);
//   });

const reviewsContainer = document.querySelector('#reviews-container')

async function fetchReviews() {
  const res = await fetch('http://localhost:3000/api/userreviews');
  const data = await res.json();
  console.log('fetched data from /api/userreviews:', data)
  return data;
}

async function fetchAndDisplayReviews() {
  try {
    const dramas = await fetchReviews()
    reviewsContainer.innerHTML = '';
    // Create HTML string for all reviews
    let reviewsHTML = '';

    dramas.forEach(drama => {
      const dramaName = Object.keys(drama)[0]
      const reviewersArr = drama[dramaName]

      reviewsHTML += `<h1>${dramaName}</h1>`
      reviewersArr.forEach(review => {
        reviewsHTML += `
              <div class="review">
                <h3>${review.reviewer}</h3>
                <p>Score: <span class="score">${review.score}</span></p>
              </div>
            `;
      })
    });
    // Insert all reviews at once using insertAdjacentHTML
    reviewsContainer.insertAdjacentHTML('beforeend', reviewsHTML);
  } catch (error) {
    console.log('error', error)
  }
}
fetchAndDisplayReviews();