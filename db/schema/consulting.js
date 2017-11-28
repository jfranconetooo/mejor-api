var mongoose = require('mongoose');

function init_schema() {
  var consultingSchema = new mongoose.Schema({
    date: {
      type: Date
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  });

  return mongoose.model('Consulting', consultingSchema);
};

module.exports = init_schema();