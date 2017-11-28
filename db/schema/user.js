var mongoose = require('mongoose');

function init_schema() {
  var userSchema = new mongoose.Schema({
    instagramId: String,
    username: String,
    birth_date: {
      type: Date
    },
    profile_picture: String,
    full_name: String,
    city: String,
    education: String,
    occupation: String,
    email: String
  });

  return mongoose.model('User', userSchema);
};

module.exports = init_schema();