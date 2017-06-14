//const express = require('express');

//mport express from 'express';
const express = require('express');
const jsonParser = require('body-parser').json();
const path = require('path');

const {MenuConnectid} = require('../models/menuConnectModels');
//import Dishid from '../models/dishModels';

const router = express.Router();
router.use(jsonParser);

// Get endpoint
router.get('/menu', (req,res) => {
  MenuConnectid
    .find()
    .exec()
    .then(menuItem => {
      res.json(menuItem);
    })
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error - GET Connection - menu/location'})
    });
});

// POST endpoint
router.post('/menu', (req, res) => {
  const requiredFields = ['dishes', 'location'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  MenuConnectid
    .create({
      dishes: req.body.dishes,
      location: req.body.location
    })
    .then(
        menuitem => res.status(201).json(menuitem)
    )
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });
});

// populate

router.get('/checkMenu', (req,res) => {
  MenuConnectid
    .find()
    .populate('dishes')
    .populate('location')
    .exec()
    .then(dishByLocation => res.json(dishByLocation))
});

module.exports = router;