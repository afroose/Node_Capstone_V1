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

// Create virtual for address - Simplify format for readability

locationSchema.virtual('addressString').get(function() {
  return `${this.address.building} ${this.address.street}, ${this.address.city}, ${this.address.state} ${this.address.zipcode}`.trim()});

// Create Instance for address - do not return coords
locationSchema.methods.apiRepr = function() {

  return {
    id: this._id,
    locationName: this.locationName,
    address: this.addressString
  };
}

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Locationid = mongoose.model('Locationid', locationSchema);

module.exports = {Locationid};