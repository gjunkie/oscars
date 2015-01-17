
exports.newUser = {
  handler: {
    waterfall: [
      // create user
      function(request, done) {

        // logic to create user

        done(null, actors);
      }
    ]
  }
};

exports.categories = {
  handler: {
    waterfall: [
      function(request, done) {
        var categories = [
          'Best Film',
          'Best Actress'
        ]
        done(null, categories);
      }
    ]
  }
};

exports.actors = {
  handler: {
    waterfall: [
      function(request, done) {
        var actors = [
          'Tom Cruise',
          'Jeremy Renner'
        ]
        done(null, actors);
      }
    ]
  }
};
