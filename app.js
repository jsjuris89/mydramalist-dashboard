const reviewsContainer = document.querySelector('#reviews-container');

async function fetchAndDisplayReviews() {
  try {
    const response = await fetch('http://localhost:3000/api/search');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const reviews = await response.json();
    const byHighestScore = reviews
      .map(({ reviewer, total }) => ({ reviewer, total }))
      .sort((a, b) => b.total - a.total);

    const html = byHighestScore.map(({ reviewer, total }) => `
        <div class="review">
          <h3>${reviewer}</h3>
          <p>Total Score: <span class="score">${total}</span></p>
        </div>
      `).join('');
    reviewsContainer.innerHTML = html;

  } catch (error) {
    console.error('Failed to fetch:', error);
    reviewsContainer.innerHTML = '<p class="error">Could not load reviews.</p>';
  }
}
fetchAndDisplayReviews();



