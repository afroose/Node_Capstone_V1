const express = require('express');
const jsonParser = require('body-parser').json();
const path = require('path');

const {Locationid} = require('../models/locationModels');

const router = express.Router();
router.use(jsonParser);

// Get endpoint

router.get('/location', (req,res) => {
  Locationid
    .find()
    .exec()
    .then(locations => {
      res.json(locations);
    });
});

// POST endpoint
router.post('/location', (req, res) => {
  const requiredFields = ['locationName'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  Locationid
    .create({
      locationName: req.body.locationName
    })
    .then(
      console.log(req.body.dishname)
    )
    .then(
        location => res.status(201).json(location)
    )
    .catch(err => {
        console.error(err);
        res.status(500).json({error: 'Something went wrong'});
    });
});

module.exports = router;