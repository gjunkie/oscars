var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var filmSchema = mongoose.Schema({
  title: String,
  slug: String,
  nominations: [String],
  released: { type: Date, default: Date.now },
  director: {
    type: ObjectId,
    ref: 'Artist'
  },
  actors: [{
    type: ObjectId,
    ref: 'Artist'
  }],
  cinematographers: [{
    type: ObjectId,
    ref: 'Artist'
  }],
  editors: [{
    type: ObjectId,
    ref: 'Artist'
  }],
  editors: [{
    type: ObjectId,
    ref: 'Artist'
  }],
});

module.exports = mongoose.model('Film', filmSchema);
