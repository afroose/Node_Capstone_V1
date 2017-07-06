const express = require('express');
const jsonParser = require('body-parser').json();
const path = require('path');

const {menuConnectId} = require('../models/menuConnectModels'); // combines dish and location ids using populate

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

  menuConnectId
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

// populate - retrieves all dishes by location
router.get('/', (req,res) => {
  menuConnectId
    .find()
    .populate('dishes')
    .populate('location')
    .exec()
    .then(dishByLocation => res.json(dishByLocation))
});

// populate by location as filter (used in menusearch.html)
router.get('/dish', (req,res) => {
  const filters = {}
  const queryableFields = ['location'];
  queryableFields.forEach(field => {
      if (req.query[field]) {
          filters[field] = req.query[field];
      }
  });
  menuConnectId
    .find(filters)
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
      `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
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

  menuConnectId
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}) // find by Mongoose ID
    .exec()
    .then(
      menuConnectId => res.status(204).end())
    .catch(err => res.status(404).json({message: 'ID not found'}));
});

// DELETE endpoint
router.delete('/:id', (req, res) => {
  menuConnectId
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(menuConnectId => res.status(204).end())
    .catch(err => res.status(404).json({message: 'ID not found'}));
});

module.exports = router;