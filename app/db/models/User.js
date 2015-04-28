var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
  id: String,
  name: String,
  email: String,
  creationDate: { type: Date, required: true, default: Date.now },
  correct: Number,
  color: String,
  games: [{
    type: ObjectId,
    ref: 'Game'
  }]
});

module.exports = mongoose.model('User', userSchema);
