//const express = require('express');

//mport express from 'express';
const express = require('express');
const jsonParser = require('body-parser').json();
const path = require('path');

const {MenuConnectid} = require('../models/menuConnectModels');
//import Dishid from '../models/dishModels';

const router = express.Router();
router.use(jsonParser);

// POST endpoint
router.post('/', (req, res) => {
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

router.get('/', (req,res) => {
  MenuConnectid
    .find()
    .populate('dishes')
    .populate('location')
    .exec()
    .then(dishByLocation => res.json(dishByLocation))
});

// PUT endpoint - 1 updateable field - description - example: http://localhost:8080/dish/593875abd0db4334c433cbd7
router.put('/:id', (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }

  const toUpdate = {};
  const updateableFields = ['dishes', 'location'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  MenuConnectid
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}) // find by Mongoose ID
    .exec()
    .then(
      MenuConnectid => res.status(204).end())
    .catch(err => res.status(404).json({message: 'ID not found'}));
});

// DELETE endpoint
router.delete('/:id', (req, res) => {
  MenuConnectid
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(MenuConnectid => res.status(204).end())
    .catch(err => res.status(404).json({message: 'ID not found'}));
});

module.exports = router;