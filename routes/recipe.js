const express = require('express');
const router  = express.Router();

/* GET home page */
router.get('/index', (req, res, next) => {
  res.render('recipe/index');
});

router.get('/favourite', (req, res, next) => {
  res.render('recipe/favourite');
});

module.exports = router;