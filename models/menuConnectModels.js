const mongoose = require('mongoose');

// this is our schema to connect menus and locations
const menuConnectSchema = mongoose.Schema({
  dishes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Dishids' }],
  location: [{type: mongoose.Schema.Types.ObjectId, ref: 'Locationid' }]
});

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const MenuConnectid = mongoose.model('MenuConnectid', menuConnectSchema);

module.exports = {MenuConnectid};