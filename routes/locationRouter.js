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
})

module.exports = router;