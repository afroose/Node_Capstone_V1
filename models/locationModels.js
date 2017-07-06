const mongoose = require('mongoose');

// this is our schema to represent a location (school/cafeteria/restaurant)
const locationSchema = mongoose.Schema({
  locationName: {type: String, required: true},
  address: {
    city: String,
    street: String,
    building: String,
    state: String,
    zipcode: String,
    // coord will be an array of string values
    coord: [String]
  }
});

// Create virtual for address - Simplify format for readability
locationSchema.virtual('addressString').get(function() {
  return `${this.address.street}, 
          ${this.address.building},  
          ${this.address.city},  
          ${this.address.state}  
          ${this.address.zipcode}`.trim()});

// Create Instance for address
locationSchema.methods.apiRepr = function() {
  return {
    id: this._id,
    locationName: this.locationName,
    address: this.addressString
  };
}

const locationId = mongoose.model('locationId', locationSchema);

module.exports = {locationId};