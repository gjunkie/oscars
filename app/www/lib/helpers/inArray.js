module.exports = function (array, value, options) {
  var users = {};
  for (var i = 0, len = array.length; i < len; i++) {
    if (array[i]) {
      users[array[i].id] = array[i];
    }
  }
  if (value.id in users) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
};
