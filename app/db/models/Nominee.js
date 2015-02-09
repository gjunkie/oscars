var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var nomineeSchema = mongoose.Schema({
  name: String,
  slug: String,
  category: String,
  type: String,
  winner: { type: Boolean, default: false },
  artist: {
    type: ObjectId,
    ref: 'Artist'
  },
  film: {
    type: ObjectId,
    ref: 'Film'
  },
  votes: [{
    type: ObjectId,
    ref: 'User'
  }],
  favorites: [{
    type: ObjectId,
    ref: 'User'
  }],
  viewers: [{
    type: ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model('Nominee', nomineeSchema);
