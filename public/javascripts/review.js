let writeReview = document.getElementById("writeReview");
let reviewSubmit = document.getElementById("reviewSubmit");
let popup = document.querySelector('.popup');
let closeEle = document.querySelector('.closeImg');
let showReview = document.querySelector('.showReview');
let reviewContainer = document.querySelector('.reviewContainer');
let addToFavourites = document.querySelector('.addToFavourites')
let recipeIden = document.querySelector('.recipeIden').innerHTML;

const checkFavorites = () => {
  axios.get(`/recipe/favourite/check/${recipeIden}`)
  .then(res => {
     console.log("Response from Backend :",res.data);
     if(res.data) {
       addToFavourites.checked = true;
     } else {
       addToFavourites.checked = false;
     }
  })
  .catch(e => console.log(e))
}
checkFavorites();

addToFavourites.addEventListener('click', () => {
  console.log("recipeIden :",recipeIden)
  if(addToFavourites.checked) {
    axios.post('/recipe/favourite/add', {recipeIden})
    .then(res => {
       console.log("Response from Backend :",res);
    })
    .catch(e => next(e))
  } else if(!addToFavourites.checked) {
    axios.post('/recipe/favourite/remove', {recipeIden})
    .then(res => {
       console.log("Response from Backend :",res);
    })
    .catch(e => next(e))
  }
})
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
    window.location.reload(false); 
  })
  .catch(e => next(e));
})

showReview.addEventListener('click', (e) => {
  if(showReview.checked){
    reviewContainer.style.display = "flex";
    // let ratings = document.querySelectorAll('.rating');
    // console.log("ratings: ", ratings);
    // for(let i=1; i <= ratings.length; i++ ) {
    //   console.log("ratings[i].children[0].div.rating-number : ", ratings[i].children[0].div.rating-number)
    //   for(let j=1; j <= ratings[i].children[0].div.rating-number; j++) {
    //       ratings[i].children[j].span.style.classList('checked');
    //   }
    // }
  } else {
    reviewContainer.style.display = "none";
  }
})

