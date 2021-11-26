var express = require('express');
var router = express.Router();
const User = require('../models/User');
var jwt = require('jsonwebtoken');

const privateKey = "Redacted"

router.use(function(req, res, next) {
  try{
  req.decoded_token = jwt.verify(req.body.access_token,privateKey,{ algorithm: 'RS256' })
  console.log(req.decoded_token)
  next()
  }catch(err){
    res.status(401).json({"error": "Invalid token"});
  }
  });

  router.get('/:userId', async function(req, res, next) {
    const userList = await User.find().exec();
    console.log(userList);
    
    res.status(200).json(userList.map((user)=>({username: user.username, id: user._id}))/*[{"name": "Henry"},{"name": "Frank"}]*/);
    
  });

  router.get('/', async function(req, res, next) {
    const userList = await User.find().exec();
    console.log(userList);
    
    res.status(200).json(userList.map((user)=>({username: user.username, id: user._id}))/*[{"name": "Henry"},{"name": "Frank"}]*/);
    
  });






module.exports = router;
