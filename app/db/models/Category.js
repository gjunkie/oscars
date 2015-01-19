var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var categorySchema = mongoose.Schema({
  category: String,
  nominees: [{
    type: ObjectId,
    ref: 'Nominee'
  }],
});

module.exports = mongoose.model('Category', categorySchema);
