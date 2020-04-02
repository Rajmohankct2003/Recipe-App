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
  axios.get(`https://api.spoonacular.com/recipes/findByIngredients?ingredients="${req.body.ingredient}"&number=5&limitLicense=false&ranking=1&ignorePantry=true&apiKey=690868cfaafc4e0bb88ddf1c2f06651a`)
    .then( appres => {
      console.log("Response from API:", appres.data)
      res.render('recipe/list', {data: appres.data})
    })
})



module.exports = router;