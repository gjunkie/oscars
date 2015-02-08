var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var artistSchema = mongoose.Schema({
  name: String,
  nominations: [{
    category: String,
    film: {
      type: ObjectId,
      ref: 'Film'
    }
  }]
});

module.exports = mongoose.model('Artist', artistSchema);
