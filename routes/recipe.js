const express = require('express');
const router  = express.Router();
const axios   = require('axios');

/* GET home page */
router.get('/search', (req, res, next) => {
  res.render('recipe/search');
});

router.get('/favourite', (req, res, next) => {
  res.render('recipe/favourite');
});

router.post('/search', (req, res, next) => {
  console.log('request body', req.body.ingredient )
  axios.get(`https://api.spoonacular.com/recipes/complexSearch?query="${req.body.ingredient}"&diet="Vegetarian"&instructionsRequired=true&apiKey=${process.env.SPOONACULAR_APIKEY}`)
    .then( apires => {
      console.log("Response from API:", apires.data);
      res.render('recipe/list', {data: apires.data.results});
    })
})
router.get('/detail/:id', (req,res,next) => {
  axios.get(`https://api.spoonacular.com/recipes/${req.params.id}/information?includeNutrition=false&apiKey=${process.env.SPOONACULAR_APIKEY}`)
    .then( apires => {
      console.log("Response from API:", apires.data);
      res.render('recipe/detail',{data: apires.data});
    })
})


module.exports = router;