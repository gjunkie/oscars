var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var nomineeSchema = mongoose.Schema({
  name: String,
  artists: [{
    type: ObjectId,
    ref: 'Artist'
  }],
  film: {
    type: ObjectId,
    ref: 'Film'
  },
  nominations: [{
    type: ObjectId,
    ref: 'Nomination'
  }],
});

module.exports = mongoose.model('Nominee', nomineeSchema);
