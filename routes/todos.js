var express = require('express');
var router = express.Router();
const ToDo = require('../models/ToDo');
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



router.get('/:id', async function (req, res, next) {

  const todo = await ToDo.find().where('_id').equals(req.params.id).exec()
  //console.log(todo);





  res.status(200).json({ title: todo.title, description: todo.description, dateCreated: todo.dateCreated, dateCompleted: todo.dateCompleted, complete: todo.complete, author: todo.author, canToggleOrDelete: (req.payload && (req.payload.id === todo.author)), id: todo._id });

});

router.put('/:id', async function (req, res, next) {

  if (!req.payload) {
    res.status(401).json({ error: "No token" })
  }

  const todos = await ToDo.findOne().where('_id').equals(req.params.id).exec()

  if (req.payload.id !== todos.author) {
    res.status(401).json({ error: "Unauthorized update" })
  }else{
  todos.title = req.body.title;
  todos.description = req.body.description;
  todos.dateCreated = req.body.dateCreated;
  todos.complete = req.body.complete;
  todos.dateCompleted = req.body.dateCompleted;
  
  console.log(todos);
  await todos.save().then(savedToDo => {
    res.status(200).json(savedToDo);
  })
}






});

router.delete('/:id', async function (req, res, next) {

  if (!req.payload) {
    res.status(401).json({ error: "No token" })
  }

  const todos = await ToDo.findOne().where('_id').equals(req.params.id).exec()
  console.log(todos);


  if (req.payload.id !== todos.author) {
    res.status(401).json({ error: "Unauthorized delete" })
  }else{

  todos.deleteOne()

  res.status(200).json({ message: "Deleted ToDo" })
  }






});

router.get('/', async function (req, res, next) {
/*

  if (req.body.userId) {
      const todos = await ToDo.find(req.body.userId).exec();
      console.log(todos);
      res.status(200).json(todos.map((todo) => ({ title: todo.title, description: todo.description, dateCreated: todo.dateCreated, dateCompleted: todo.dateCompleted, complete: todo.complete, author: todo.author, canToggleOrDelete: false, id: todo._id })))
  
  } else {
    const todos = await ToDo.find().exec();
    console.log(todos);
    res.status(200).json(todos.map((todo) => ({ title: todo.title, description: todo.description, dateCreated: todo.dateCreated, dateCompleted: todo.dateCompleted, complete: todo.complete, author: todo.author, canToggleOrDelete: false, id: todo._id })))
  
  }
*/
    if (req.body.userId) {
      const todos = await ToDo.find(req.body.userId).exec();
      //console.log(todos);
      if(!req.payload){
         res.status(200).json(todos.map((todo) => ({ title: todo.title, description: todo.description, dateCreated: todo.dateCreated, dateCompleted: todo.dateCompleted, complete: todo.complete, author: todo.author, canToggleOrDelete: false, id: todo._id })))
      }
      else{
        res.status(200).json(todos.map((todo) => ({ title: todo.title, description: todo.description, dateCreated: todo.dateCreated, dateCompleted: todo.dateCompleted, complete: todo.complete, author: todo.author, canToggleOrDelete: todo.author === req.payload.id, id: todo._id })))
      }
  } else {
    const todos = await ToDo.find().exec();
    //console.log(todos);
    if(!req.payload){
    res.status(200).json(todos.map((todo) => ({ title: todo.title, description: todo.description, dateCreated: todo.dateCreated, dateCompleted: todo.dateCompleted, complete: todo.complete, author: todo.author, canToggleOrDelete: false, id: todo._id })))
    }else{
      res.status(200).json(todos.map((todo) => ({ title: todo.title, description: todo.description, dateCreated: todo.dateCreated, dateCompleted: todo.dateCompleted, complete: todo.complete, author: todo.author, canToggleOrDelete: todo.author === req.payload.id, id: todo._id })))
    }
  }




});

router.post('/', async function (req, res, next) {
  const todo = new ToDo({
    "title": req.body.title,
    "description": req.body.description,
    "dateCreated": req.body.dateCreated,
    "complete": req.body.complete,
    "dateCompleted": req.body.dateCompleted,
    "author": req.payload.id,
    
    //req.payload.id 
  })

  await todo.save().then(savedPost => {
    //const canToggle = savedPost.author===req.payload.id;
    return res.status(201).json({
      "id": savedPost._id,
      "title": savedPost.title,
      "description": savedPost.description,
      "dateCreated": savedPost.dateCreated,
      "complete": savedPost.complete,
      "dateCompleted": savedPost.dateCompleted,//,
      "author": savedPost.author
      //"canToggleOrDelete": canToggle,
    })
  }).catch(error => {
    return res.status(500).json({ "error": error.message })
  });

});





module.exports = router;