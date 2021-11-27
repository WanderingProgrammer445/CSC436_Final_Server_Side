var express = require('express');
var router = express.Router();
const User = require('../models/User');
var jwt = require('jsonwebtoken');

const privateKey = "Redacted";

router.use(function (req, res, next) {

  console.log(req.header("Authorization"))
  if (req.header("Authorization")) {
    try {
      req.payload = jwt.verify(req.header("Authorization"), privateKey, { algorithms: ['RS256'] })
      console.log(req.payload)
    } catch (error) {
      return res.status(401).json({ "error": error.message });
    }
  }
  next()
})

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
