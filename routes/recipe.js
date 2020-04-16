const express = require('express');
const router  = express.Router();
const axios   = require('axios');
const Recipe  = require('../models/recipe' );
const Favourites = require('../models/favourites');

/* GET home page */
router.get('/search', (req, res, next) => {
  res.render('recipe/search');
});

router.post('/favourite/add', (req, res, next) => {
  console.log("req.body.recipeIden :", req.body )
  const recipeId = req.body.recipeIden;
  Favourites.findOne({ userId: req.user._id })
  .then( resp => {
    if(resp) {
      Favourites.updateOne({
        userId: req.user._id
      }, {
        $push: {recipeId: recipeId}
      })
      .then(resp => console.log("Favourites updated"))
      .catch(e => next(e))
    } else {
      Favourites.create({
        userId: req.user._id,
        recipeId: recipeId
      })
      .then(resp => console.log("Added to Favourite"))
      .catch(e => next(e))
    }
  })
  .catch(e => next(e))
  res.send('Successfully added to Favourite');
});

router.post('/favourite/remove', (req, res, next) => {
  const recipeId = req.body.recipeIden;
  Favourites.findOne({ userId: req.user._id })
  .then( resp => {
    if(resp) {
      Favourites.updateOne({
        userId: req.user._id
      }, {
        $pull: {recipeId: recipeId}
      })
      .then(res => console.log("Favourites removed"))
      .catch(e => next(e))
    }
  })
  .catch(e => next(e))
  res.send('Successfully removed from Favourite');
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
    .then(list => {
      console.log("List : ", list.recipeId);
      let listOfRecipes = [];
      list.recipeId.map(recId => {
        Recipe.findOne({recipeId: recId})
         .then(recipe => {
           listOfRecipes.push({ 
             image: recipe.image, 
             title: recipe.title, 
             id: recipe.recipeId
            })
            // console.log("List of Recipes :", listOfRecipes);
         })
         .catch(e => next(e))
      } )
      console.log("List of Recipes2 :", listOfRecipes);
      console.log("Length of :", listOfRecipes.length);
      res.render('recipe/list', {data: listOfRecipes});
    })
    .catch(e => next(e))
})

router.post('/search', (req, res, next) => {
  console.log('request body', req.body.ingredient )
  axios.get(`https://api.spoonacular.com/recipes/complexSearch?query="${req.body.ingredient}"&diet="${req.body.diet}"&instructionsRequired=true&number=12&apiKey=${process.env.SPOONACULAR_APIKEY}`)
    .then( apires => {
      console.log("Response from API:", apires.data);
      res.render('recipe/list', {data: apires.data.results});
    })
})
router.get('/detail/:id', (req,res,next) => {
  axios.get(`https://api.spoonacular.com/recipes/${req.params.id}/information?includeNutrition=false&apiKey=${process.env.SPOONACULAR_APIKEY}`)
    .then( apires => {
      console.log("Response from API:", apires.data);

      Recipe.find({ recipeId: req.params.id})
        .then( reviews => {

          if(reviews.length === 0) {
            Recipe.create({
              recipeId: apires.data.id,
              title: apires.data.title,
              image: apires.data.image         
            })
            .then(rec => console.log("Recipe Created :", rec))
            .catch(e => next(e))
          } else {
            console.log("Reviews : ", reviews.length)
          }
          
          res.render('recipe/detail',{data: apires.data, user: req.user, reviews});
        })
        .catch(e => next(e))
    })
    .catch(e => next(e))
})

router.post('/review', (req,res,next) => {
  console.log("Request Body : ", req.body);
  console.log("Request User : ", req.user);
  Recipe.findOne({recipeId: req.body.recipeId, userId: req.user._id})
   .then(resp => {
     console.log("response", resp)
     if(!resp) {
       console.log("recipe not found");
       Recipe.create({
         recipeId: req.body.recipeId,
         userId: req.user._id,
         firstname: req.user.firstname,
         rating: req.body.rating,
         comments: req.body.comments
       })
       .then(resp1 => 
        console.log("successfully created : ", resp1))
       .catch(e => {
        console.log("Error in creation: ", e) 
        next(e)
      })
     } else {
      console.log("recipe found");
       Recipe.updateOne({
        recipeId: req.body.recipeId,
        userId: req.user._id
       }, { $set: {
            firstname: req.user.firstname,
            rating: req.body.rating,
            comments: req.body.comments
          }
       })
       .then(e => next(e))
     }
   
    })
    .catch(e => next(e))    
    res.send("succesfull")
})


module.exports = router;