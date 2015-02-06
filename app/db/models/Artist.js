var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var artistSchema = mongoose.Schema({
  name: String,
  nominations: [String]
});

module.exports = mongoose.model('Artist', artistSchema);
