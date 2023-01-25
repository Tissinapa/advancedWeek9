var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const {body, validationResult} = require("express-validator")
const User = require("../models/Users")

let kayttis = {
  email: "asdf@wer",
  password: "asdfasdf"

}
/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

router.post("/api/user/register/",body("email"),body("password"),
(req, res, next) =>{
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array()})
  }
  console.log(req.body)
  User.findOne({email: kayttis.email},(err, email) => {
    if(err) throw err
    if(email){
      return res.status(403).json({email: "Email already in use."})
    }else {
      bcrypt.genSalt(10,(err, salt)=>{
        bcrypt.hash(kayttis.password, salt, (err, hash)=>{
          if(err) throw err;
          User.create(
            {
              email: kayttis.email,
              password: hash
            },(err, ok)=>{
              if(err) throw err;
              return res.send(req.body.User)
            }
          )
        })
      })
    }
  })
})

module.exports = router;
