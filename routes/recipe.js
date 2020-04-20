const express = require('express');
const router  = express.Router();
const axios   = require('axios');
const Recipe  = require('../models/recipe' );
const Favourites = require('../models/favourites');

/* GET home page */
router.get('/search', (req, res, next) => {
  res.render('recipe/search', { user: req.user } );
});

router.post('/favourite/add', (req, res, next) => {
  console.log("req.body.recipeIden :", req.body )
  const recipeId = req.body.recipeIden;
  Favourites.findOne({ userId: req.user._id })
  .then( resp => {
    if(resp) {
      return Favourites.updateOne({
        userId: req.user._id
      }, {
        $push: {recipeId: recipeId}
      })  
    } else {
      return Favourites.create({
        userId: req.user._id,
        recipeId: recipeId
      })
    }
  })
  .then(resp => {
    console.log("Favourites added/updated")
    res.send('Successfully added to Favourite');
  })
  .catch(e => next(e))
});

router.post('/favourite/remove', (req, res, next) => {
  const recipeId = req.body.recipeIden;
  Favourites.findOne({ userId: req.user._id })
  .then( resp => {
    if(!resp) {
      throw('Favourites not found');
    }
    return Favourites.updateOne({
      userId: req.user._id
    }, {
      $pull: {recipeId: recipeId}
    })
  })
  .then(resp => {
    console.log("Favourites removed");
    res.send('Successfully removed from Favourite');
  })
  .catch(e => next(e))
});

router.get('/favourite/check/:recipeId', (req, res, next) => {
  const recipeId = req.params.recipeId;
  
  Favourites.findOne({ userId: req.user._id, recipeId: recipeId })
  .then(resp => {
    if(resp) {
      res.send("true");
    } else {
      res.send("false");
    }
  })
  .catch(e => next(e))
})

router.get('/favourite/list', (req, res, next) => {
   Favourites.findOne({userId: req.user._id}) 
    .then(favourite => {
      if(!favourite){
        return null
      }
      return Recipe.find({
        recipeId: { $in: favourite.recipeId }, 
        title: {$exists: true, $ne: null } 
      })
    })
    .then(listOfRecipes => {
        console.log("list of recipes :",listOfRecipes);
        res.render('recipe/favourites', { 
          data: listOfRecipes, 
          user:req.user
        });
    })
    .catch(e => next(e))
})

router.post('/search', (req, res, next) => {
  console.log('request body', req.body.ingredient )
  axios.get(`https://api.spoonacular.com/recipes/complexSearch?query="${req.body.ingredient}"&diet="${req.body.diet}"&instructionsRequired=true&number=9&apiKey=${process.env.SPOONACULAR_APIKEY}`)
    .then( apires => {
      console.log("Response from API:", apires.data);
      res.render('recipe/list', {data: apires.data.results, user:req.user});
    })
})
router.get('/detail/:id', (req,res,next) => {
  axios.get(`https://api.spoonacular.com/recipes/${req.params.id}/information?includeNutrition=false&apiKey=${process.env.SPOONACULAR_APIKEY}`)
    .then( apires => {
      // console.log("Response from API:", apires.data);
         Recipe.find({ recipeId: req.params.id })
        .then( reviews => {
          console.log("Reviews : ", reviews)
          if(reviews.length === 0) {
            Recipe.create({
              recipeId: apires.data.id,
              title: apires.data.title,
              image: apires.data.image         
            })
            .then(rec => console.log("Recipe Created :", rec))
            .catch(e => next(e))
          } else {
                console.log("Reviews.length : ", reviews.length)                
                reviews.map(review => { 
                    console.log("Review.stars : ", review.stars);
                })
          }
          console.log("Review.stars 2 : ", reviews);
          res.render('recipe/detail',{data: apires.data, user: req.user, reviews});
        })
    })
    .catch(e => next(e))
  .catch(e => next(e))
})

router.post('/review', (req,res,next) => {
  // console.log("Request Body : ", req.body);
  // console.log("Request User : ", req.user);
  let stars =[];
  switch (req.body.rating) {
    case 5:
    case '5':
      stars = [ true, true, true, true, true];
      break;
    case 4:
    case '4':
      stars = [ true, true, true, true, false];
      break;
    case 3:
    case '3':
      stars = [ true, true, true, false, false];
      break;
    case 2:
    case '2':
      stars = [ true, true, false, false, false];
      break;
    case 1:
    case '1':
      stars = [ true, false, false, false, false];
      break;
  } 
  Recipe.findOne({recipeId: req.body.recipeId, userId: req.user._id})
   .then(resp => {
     if(!resp) {
       return Recipe.create({
         recipeId: req.body.recipeId,
         userId: req.user._id,
         firstname: req.user.firstname,
         rating: req.body.rating,
         stars: stars,
         comments: req.body.comments
       })
     } else {
       return Recipe.updateOne({
        recipeId: req.body.recipeId,
        userId: req.user._id
       }, { $set: {
            firstname: req.user.firstname,
            rating: req.body.rating,
            stars: stars,
            comments: req.body.comments
          }
       })
     }
    })
    .then(resp => {
      console.log("Recipe created/updated")
      res.send("succesfull")
    })
    .catch(e => next(e))    
    
})

module.exports = router;