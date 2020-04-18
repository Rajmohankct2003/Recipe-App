const express = require('express');
const router  = express.Router();
const User = require("../models/user");
/* GET home page */

router.get('/show', (req, res, next) => {
  console.log("req.user : ",req.user);
  res.render('profile/show', {user: req.user});
});

const Multer = require('multer');
// const Image = require('./models/image')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')

const s3 = new aws.S3();

const uploader = new Multer({
  storage: multerS3({
    s3: s3,
    bucket: 'recipeapp123',
    acl: 'public-read',
    key: function(req, file, cb) {
      cb(null, Date.now().toString())
    }
  })
})

router.get('/update', (req, res, next) => {
  res.render('profile/update', {user: req.user} );
});

router.post('/update', uploader.single('picture'), (req, res, next) => {
  console.log("req.file :", req.file);
  User.updateOne({ _id: req.user.id }, { 
    $set: { firstname: req.body.firstname,
            lastname: req.body.lastname,
            picture: req.file.location,
            age: req.body.age  
          } 
        })
  .then(upduser => {
       res.redirect('/profile/show')
     })
  .catch(e => next(e))

});

module.exports = router;
