const reviewsContainer = document.querySelector('#reviews-container');

async function fetchAndDisplayReviews() {
  try {
    const response = await fetch('http://localhost:3000/api/search');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const reviews = await response.json();
    console.log(reviews)
    const byHighestScore = reviews
      .map(({ reviewer, total, all_notes }) => ({ reviewer, total, all_notes }))
      .sort((a, b) => b.total - a.total);

    const html = byHighestScore.map(({ reviewer, total, all_notes }) => {
      const commentsHtml = all_notes
        ? all_notes.split('|').map(comment => `<p class="comment">${comment.trim()}</p>`).join('')
        : '<p>No comments available.</p>';

      return `
        <div class="review">
          <h3>${reviewer}</h3>
          <p>Total Score: <span class="score">${total}</span></p>
          <button class="toggle-comments-btn">Show Comments</button>
          <div class="comments-container" style="display: none;">
            ${commentsHtml}
          </div>
        </div>
      `;
    }).join('');
    reviewsContainer.innerHTML = html;

    document.querySelectorAll('.toggle-comments-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const reviewElement = event.currentTarget.closest('.review');
        const commentsContainer = reviewElement.querySelector('.comments-container');
        const isHidden = commentsContainer.style.display === 'none';
        commentsContainer.style.display = isHidden ? 'block' : 'none';
        event.currentTarget.textContent = isHidden ? 'Hide Comments' : 'Show Comments';
      });
    });

  } catch (error) {
    console.error('Failed to fetch:', error);
    reviewsContainer.innerHTML = '<p class="error">Could not load reviews.</p>';
  }
}
fetchAndDisplayReviews();



