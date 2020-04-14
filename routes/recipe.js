const express = require('express');
const router  = express.Router();
const axios   = require('axios');
const Recipe  = require('../models/recipe' );

/* GET home page */
router.get('/search', (req, res, next) => {
  res.render('recipe/search');
});

router.get('/favourite', (req, res, next) => {
  res.render('recipe/favourite');
});

router.post('/search', (req, res, next) => {
  console.log('request body', req.body.ingredient )
  axios.get(`https://api.spoonacular.com/recipes/complexSearch?query="${req.body.ingredient}"&diet="${req.body.diet}"&instructionsRequired=true&number=9&apiKey=${process.env.SPOONACULAR_APIKEY}`)
    .then( apires => {
      console.log("Response from API:", apires.data);
      res.render('recipe/list', {data: apires.data.results});
    })
})
router.get('/detail/:id', (req,res,next) => {
  axios.get(`https://api.spoonacular.com/recipes/${req.params.id}/information?includeNutrition=false&apiKey=${process.env.SPOONACULAR_APIKEY}`)
    .then( apires => {
      // console.log("Response from API:", apires.data);

      Recipe.find({ recipeId: req.params.id})
        .then( reviews => {
          console.log("Reviews : ", reviews)
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