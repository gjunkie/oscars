var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var categorySchema = mongoose.Schema({
  name: String,
  slug: String,
  primary: String,
  secondary: String,
  slots: Number,
  nominees: [{
    type: ObjectId,
    ref: 'Nominee'
  }],
});

module.exports = mongoose.model('Category', categorySchema);
