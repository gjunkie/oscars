var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var artistSchema = mongoose.Schema({
  name: String,
  nominations: [{
    type: ObjectId,
    ref: 'Nomination'
  }],
});

module.exports = mongoose.model('Artist', artistSchema);
