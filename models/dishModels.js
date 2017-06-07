const mongoose = require('mongoose');

// this is our schema to represent a dish in the menus
const dishSchema = mongoose.Schema({
  name: {type: String, required: true}
});

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Dishids = mongoose.model('Dishids', dishSchema);

module.exports = {Dishids};