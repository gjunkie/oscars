var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
  name: String,
  email: String,
  votes: [{
    selected: { type: Boolean, default: false },
    nominee: {
      type: ObjectId,
      ref: 'Nomination'
    }
  }],
  preferred: [{
    selected: { type: Boolean, default: false },
    nominee: {
      type: ObjectId,
      ref: 'Nomination'
    }
  }],
  watched: [{
    selected: { type: Boolean, default: false },
    nominee: {
      type: ObjectId,
      ref: 'Nomination'
    }
  }]
});

module.exports = mongoose.model('User', userSchema);
