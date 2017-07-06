const mongoose = require('mongoose');

// this is our schema to represent a dish in the menus
const dishSchema = mongoose.Schema({
  dishName: {type: String, required: true},
  dishDescription: {type: String}
});

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const dishId = mongoose.model('dishId', dishSchema);

module.exports = {dishId};