var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var userSchema = mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  creationDate: { type: Date, required: true, default: Date.now },
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
