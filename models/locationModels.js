const mongoose = require('mongoose');

// this is our schema to represent a location (school/cafeteria/restaurant)
const locationSchema = mongoose.Schema({
  locationName: {type: String, required: true},
  address: {
    city: String,
    building: String,
    street: String,
    state: String,
    zipcode: String,
    // coord will be an array of string values
    coord: [String]
  }
});

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Locationid = mongoose.model('Locationid', locationSchema);

module.exports = {Locationid};