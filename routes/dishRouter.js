//const express = require('express');

//mport express from 'express';
const express = require('express');
const jsonParser = require('body-parser').json();
const path = require('path');

const {Dishids} = require('../models/dishModels');
//import Dishid from '../models/dishModels';

const router = express.Router();
router.use(jsonParser);

// Get endpoint

router.get('/dish', (req,res) => {
  Dishids
    .find()
    .exec()
    .then(dishes => {
      res.json(dishes);
    });
});

// router.post('/dish', (req, res) => {
//   Dishids
//     .create({
//       dishname: req.body.dishname,
//       content: req.body.content
//     })
//     .then(
//       dishes => res.status(201).json(dishes)
//     );
// });

router.post('/dish', (req, res) => {
  const requiredFields = ['dishname', 'content'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Dishids
    .create({
      dishname: req.body.dishname,
      content: req.body.content
    })
    .then(dishes => res.status(201).json(dishes))
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });

});

module.exports = router;