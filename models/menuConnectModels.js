const mongoose = require('mongoose');

// this is our schema to connect menus and locations
const menuConnectSchema = mongoose.Schema({
  dish_id: {type: String, required: true},
  location_id: {type: String, required: true}
});

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const MenuConnectid = mongoose.model('MenuConnectid', menuConnectSchema);

module.exports = {MenuConnectid};