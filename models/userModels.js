const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// this is our schema to represent a user
const userInfoSchema = mongoose.Schema({
  email: {type: String, required: true},
  user_password: {type: String, required: true},
  role: {type: String, required: true}, // admin / patron / parent / student  
  name: {
    firstName: String,
    lastName: String
  },
  allergens: {
    milk: false,
    soy: false,
    egg: false,
    wheat: false,
    peanut: false,
    tree_nut: false,
    fish: false,
    shellfish: false
  },
  location_id: {type: String, required: true}
});

userInfoSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

userInfoSchema.statics.hashPassword = function(password) {
  //console.log(password);
  return bcrypt.hash(password, 10);
}

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.
const Userid = mongoose.model('Userid', userInfoSchema);

module.exports = {Userid};