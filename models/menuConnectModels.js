const mongoose = require('mongoose');

// this is our schema to connect menus and locations
const menuConnectSchema = mongoose.Schema({
  dishes: [{type: mongoose.Schema.Types.ObjectId, ref: 'dishId' }],
  location: [{type: mongoose.Schema.Types.ObjectId, ref: 'locationId' }]
});

const menuConnectId = mongoose.model('menuConnectId', menuConnectSchema);

module.exports = {menuConnectId};