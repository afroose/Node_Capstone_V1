const express = require('express');
const jsonParser = require('body-parser').json();
const path = require('path');

const {dishId} = require('../models/dishModels');

const router = express.Router();
router.use(jsonParser);

// GET endpoint
router.get('/', (req,res) => {
  dishId
    .find()
    .exec()
    .then(dishes => {
      res.json(dishes);
    })
    .catch(err => {
      console.error(err);
        res.status(500).json({message: 'Internal server error - GET dish'})
    });
});

// Find dish by dishName
router.get('/:dishname', (req, res) => {
  dishId
    .findOne({'dishName': req.params.dishname})
    .exec()
    .then(dishes =>res.json(dishes))
    .catch(err => {
      console.error(err);
        res.status(404).json({message: 'Dish Name Not Found'})
    });
});

// POST endpoint
router.post('/', (req, res) => {
  const requiredFields = ['dishName', 'dishDescription'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }

  let {dishName, dishDescription} = req.body;
  // var bulk = db.dishId.initializeUnorderedBulkOp();
  // bulk.find({dishName})
  //   .upsert()
  //   .update({
  //     dishName: req.body.dishName,
  //     dishDescription: req.body.dishDescription
  //   })
  // bulk.execute();

  dishId
    .find({dishName}) // find dish 
    .count() // count > 0 if exists
    .exec()
    .then( count => {
        if (count > 0) { // if dish exists - close
            console.log("already exist");
            res.json({message: 'ID not found'})
            next();
        }
        return count;
    })
    .then(
      () => {
        dishId
        .create({
          dishName: req.body.dishName,
          dishDescription: req.body.dishDescription
        })
        .then(
          console.log(req.body.dishName)
        )
        .then(
            dishes => res.status(201).json(dishes)
        )
        .catch(err => {
            console.error(err);
            res.status(500).json({error: 'Something went wrong'});
        });
      }
    )
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
  const updateableFields = ['dishDescription'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  dishId
    // all key/value pairs in toUpdate will be updated -- that's what `$set` does
    .findByIdAndUpdate(req.params.id, {$set: toUpdate}) // find by Mongoose ID
    .exec()
    .then(
      dishId => res.status(204).end())
    .catch(err => res.status(404).json({message: 'ID not found'}));
});

// DELETE endpoint
router.delete('/:id', (req, res) => {
  dishId
    .findByIdAndRemove(req.params.id)
    .exec()
    .then(dishId => res.status(204).end())
    .catch(err => res.status(404).json({message: 'ID not found'}));
});

module.exports = router;