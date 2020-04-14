let writeReview = document.getElementById("writeReview");
let reviewSubmit = document.getElementById("reviewSubmit");
let popup = document.querySelector('.popup');
let closeEle = document.querySelector('.closeImg');
let showReview = document.querySelector('.showReview');
let reviewContainer = document.querySelector('.reviewContainer');

closeEle.addEventListener('click', () => {
  popup.style.display = "none";
})

writeReview.addEventListener('click' , (e) => {
  popup.style.display = "flex";
})

reviewSubmit.addEventListener('click', (e) => {
  e.preventDefault();
  let rating = document.querySelector('.rating').value;
  let comments = document.querySelector('.comments').value;
  let recipeId = document.querySelector('.recipeId').value;
  //console.log("Rating, comments, RecipeId " , rating, comments, recipeId);
  axios.post('/recipe/review', { rating, comments, recipeId})
  .then(res => {
    popup.style.display = "none";
  })
  .catch(e => next(e))
})

showReview.addEventListener('click', (e) => {
  if(showReview.checked){
    reviewContainer.style.display = "flex"
    let ratings = document.querySelectorAll('.rating');
    
  } else {
    reviewContainer.style.display = "none"
  }
})

