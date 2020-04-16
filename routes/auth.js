const express = require("express");
const router = express.Router();
// Require user model
const User = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
// Add passport 
const passport = require('passport')

const ensureLogin = require("connect-ensure-login").ensureLoggedIn;

router.get("/signup", (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
const { username, password } = req.body
  console.log("password", password);
  bcrypt.hash(password, 10)
  .then( hashPass => {
  console.log("password hashes", hashPass);
      return User.create({
      username: username, 
      password: hashPass
      })
  })
  .then( user => {
      console.log( `${user.username} signedup`);
      res.redirect('/index');
  })
  .catch(e => console.log("e",e))
})

router.get("/login", (req, res, next) => {
  res.render('index', {message: req.flash('error')})
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/recipe/search',
  failureRedirect: '/auth/login',
  failureFlash: true
}))

router.get('/google',
passport.authenticate('google', { scope: [
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/userinfo.email"
  ]
})
);

router.get('/google/callback', 
passport.authenticate('google', { 
  successRedirect: '/profile/update',
  failureRedirect: '/auth/login'
  })
);


router.get('/logout', (req, res, next) => {
req.session.destroy(() =>{
  res.redirect('/auth/login')
})
})

module.exports = router;

