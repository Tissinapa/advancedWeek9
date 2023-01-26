var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const {body, validationResult} = require("express-validator")
const jwt = require("jsonwebtoken")
const User = require("../models/Users")
const validateToken = require("../auth/validation.js")



router.use(express.json());
router.use(bodyParser.json())
/* GET users listing. */
router.get('/', (req, res, next) => {

  res.send('toimii');
});
router.get('/private', (req, res, next) => {

  res.send('Tämä on tosi salainen jutska');
});

router.post('/user/login', body("email").trim().escape(),
body("password").trim().escape(),
(req, res, next) => {
  User.findOne({email: req.body.email},(err, user)=>{
    if(err){
      throw err
    }
    if(!user){
      return res.status(403).json({error: "Login failed."});
    } else {
      bcrypt.compare(req.body.password, user.password,(err,match)=>{
        if(err){
          throw err
        }if(match){
          const tokenPayload = {
            id: user._id,
            email: user.email
          }
          jwt.sign(
            tokenPayload,
            process.env.SECRET,
            {
              expiresIn: 120
            },
            (err, token)=>{
              if(err) throw err;
               return res.send({success: true,token: token})
            }
          )
        }
      })
    }

  })


  
});

router.post("/user/register",body("email"),body("password"),
(req, res, next) =>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }
  
  User.findOne({email: req.body.email},(err, user) => {
    if(err) {
      throw err;
    };  
    if(user){
      return res.status(403).json({email: "Email already in use."});
    }else {
      bcrypt.genSalt(10,(err, salt)=>{
        bcrypt.hash(req.body.password, salt, (err, hash)=>{
          if(err) throw err;
          User.create(
            {
              email: req.body.email,
              password: hash
            },(err,ok)=>{
              if(err) throw err;
              return res.send("ok")
            }
          );
        });
      });
    }
  });
});

module.exports = router;
