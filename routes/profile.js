const express = require('express');
const router  = express.Router();

/* GET home page */

router.get('/show', (req, res, next) => {
  res.render('profile/show');
});

router.get('/update', (req, res, next) => {
  res.render('profile/update');
});

router.post('/update', (req, res, next) => {
  res.render('profile/show');
});

module.exports = router;
