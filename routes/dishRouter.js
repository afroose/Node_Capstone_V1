//const express = require('express');

//mport express from 'express';
const express = require('express');
const jsonParser = require('body-parser').json();
const path = require('path');

const {Dishid} = require('../models/dishModels');
//import Dishid from '../models/dishModels';

const router = express.Router();
router.use(jsonParser);

// Get endpoint

router.get('/dish', (req,res) => {
  Dishid
    .find()
    .exec()
    .then(dishes => {
      res.json(dishes);
    });
})

// router.post('/dish', (req, res) => {
//   Dishid
//     .create({
//       name: req.body.name
//     })
//     .then(
//       dishes => res.status(201).json(dishes)
//     )
// })

module.exports = router;