const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// this is our schema to represent a user
const userInfoSchema = mongoose.Schema({
  email: {type: String, required: true},
  user_password: {type: String, required: true},
  role: {type: String}, // admin / patron / parent / student  
  name: {
    firstName: String,
    lastName: String
  },
  location_id: {type: String}
});

userInfoSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

userInfoSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
}

const userId = mongoose.model('userId', userInfoSchema);

module.exports = {userId};