const mongoose = require('mongoose');

// this is our schema to connect users and location collections
const userConnectSchema = mongoose.Schema({
  user_id: {type: String, required: true},
  location_id: {type: String, required: true}
});

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const UserConnectid = mongoose.model('UserConnectid', userConnectSchema);

module.exports = {UserConnectid};