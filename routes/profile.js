const express = require('express');
const router  = express.Router();
const User = require("../models/user");
/* GET home page */

router.get('/show', (req, res, next) => {
  console.log("req.user : ",req.user);
  res.render('profile/show', {user: req.user});
});

router.get('/update', (req, res, next) => {
  res.render('profile/update', {user: req.user} );
});

router.post('/update', (req, res, next) => {
  User.updateOne({ _id: req.user.id }, { 
    $set: { firstname: req.body.firstname,
            lastname: req.body.lastname,
            picture: req.body.picture,
            age: req.body.age  
          } 
        })
  .then(upduser => {
       res.redirect('/profile/show')
     })
  .catch(e => next(e))

});

module.exports = router;
