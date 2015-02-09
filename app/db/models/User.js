var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  creationDate: { type: Date, required: true, default: Date.now },
  correct: Number,
  color: String
});

module.exports = mongoose.model('User', userSchema);
