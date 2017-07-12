const express = require('express');
const jsonParser = require('body-parser').json();
const path = require('path');

const {locationId} = require('../models/locationModels');

const router = express.Router();
router.use(jsonParser);

// Get endpoint

router.get('/', (req,res) => {
  locationId
    .find()
    .exec()
    .then(locations => {
      res.json({
        locations: locations.map(
          (location) => location.apiRepr()
        )
      });
    });
});

// Find location by locationName
router.get('/Name/:location', (req, res) => {
  locationId
    .findOne({'locationName': req.params.location})
    .exec()
    .then(locations =>res.json(locations))
    .catch(err => {
      console.error(err);
        res.status(404).json({message: 'Location Name Not Found'})
    });
});

// POST endpoint
router.post('/', (req, res) => {
  const requiredFields = ['locationName', 'street', 'city', 'state', 'zipcode'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  let {locationName,street,building,city,state,zipcode} = req.body
  locationId
    .create({
      locationName: locationName,
      address:{
        street: street,
        building: building,
        city: city,
        state: state,
        zipcode: zipcode
      }
    })
    .then(
        location => res.status(201).json(location.apiRepr())
    )
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });
});

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
  const updateableFields = ['address'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  locationId
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}) // find by Mongoose ID
    .exec()
    .then(
      locationId => res.status(204).end())
    .catch(err => res.status(404).json({message: 'ID not found'}));
});

// DELETE endpoint
router.delete('/:id', (req, res) => {
  locationId
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(locationId => res.status(204).end())
    .catch(err => res.status(404).json({message: 'ID not found'}));
});

// Search - populate auto-complete
router.get('/search', (req,res) => {
  if (req.query.location.length > 2) {
    const regex = new RegExp(req.query.location,'i');
    locationId
    .find({'locationName': regex}, (err, locations) => {
      res.json(locations)
    })
  } else {
    res.json([])
  }
});

// Search - fill select field in home page
router.get('/select', (req,res) => {
  locationId
    .find()
    .exec()
    .then(locations => {
      res.json({locations}
        )
      });
});


module.exports = router;