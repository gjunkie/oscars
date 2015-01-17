var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var nominationSchema = mongoose.Schema({
  category: String,
  nominees: [{
    type: ObjectId,
    ref: 'Nominee'
  }],
});

module.exports = mongoose.model('Nomination', nominationSchema);
