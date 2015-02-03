var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var nomineeSchema = mongoose.Schema({
  name: String,
  type: String,
  artist: {
    type: ObjectId,
    ref: 'Artist'
  },
  film: {
    type: ObjectId,
    ref: 'Film'
  },
  nominations: [{
    type: ObjectId,
    ref: 'Nomination'
  }],
  votes: [{
    selected: { type: Boolean, default: false },
    user: {
      type: ObjectId,
      ref: 'User'
    }
  }],
  preferred: [{
    selected: { type: Boolean, default: false },
    user: {
      type: ObjectId,
      ref: 'User'
    }
  }],
  viewers: [{
    selected: { type: Boolean, default: false },
    user: {
      type: ObjectId,
      ref: 'User'
    }
  }]
});

module.exports = mongoose.model('Nominee', nomineeSchema);
