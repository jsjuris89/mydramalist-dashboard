// // Drama name
// // This select whole parent
// // document.querySelector('.review > div:nth-child(1)')

// // Specifically drama name <a> tag
// const dramasNamesEl = document.querySelectorAll('.review > div:nth-child(1) b a')


// // Whole scores for story, acting etc
// // document.querySelector('.review-body .review-rating')
// // Specifically story score <span> element
// const dramasStoryRatingEl = document.querySelectorAll('.review-body .review-rating div:nth-child(1) span')



// // App

// for (let i = 0; i < dramasNamesEl.length; i++) {
//   const name = dramasNamesEl[i].textContent;
//   const rating = dramasStoryRatingEl[i].textContent;
//   console.log(`${name} story: ${rating}`);
// }

// TODO get 2 numbers how many dramas scored
// a) below 5
// b) above 5

fetch("http://localhost:3000/api/data")
  .then(res => res.json())
  .then(data => {
    console.log("Received data:", data);
    // Do something with it
  });
