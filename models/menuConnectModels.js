const mongoose = require('mongoose');

// this is our schema to connect menus and locations
const menuConnectSchema = mongoose.Schema({
  dish_id: {type: String, required: true},
  location_id: {type: String, required: true},
  locations: [{type: mongoose.Schema.Types.ObjectId, ref: 'Locationid' }],
  dishes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Dishids' }]
});

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const MenuConnectid = mongoose.model('MenuConnectid', menuConnectSchema);

module.exports = {MenuConnectid};