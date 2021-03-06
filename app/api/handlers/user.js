var async = require('async');
var _ = require('lodash-node');

// TODO: change name to createUser
/* Creates a new user */
exports.login = {
  handler: {
    waterfall: [
      // create user if first login
      function(request, done) {
        var User = request.server.plugins.db.User;
        User
        .findOne({ id: request.auth.credentials.profile.raw.id })
        .exec(function(err, user){
          if (err) {
            done(null);
            //return done(Hapi.error.internal('find user', err));
          }
          if (!user) {
            var userData = {
              id: request.auth.credentials.profile.raw.id,
              name: request.auth.credentials.profile.raw.given_name,
              email: request.auth.credentials.profile.raw.email,
              correct: 0,
              color: null
            }
            User.create(userData, function(err, newUser) {
              if (err) {
                console.log('create err');
              }
              done(null, newUser);
              });
          } else {
            // TODO: should prob update the user if they exist
            done(null, user);
          }
        });
      }
    ]
  }
};

/* Gets user data */
exports.user = {
  handler: {
    waterfall: [
      // get user data
      function(request, done) {
        if (request.auth.isAuthenticated) {
          var User = request.server.plugins.db.User;
          User
            .findOne({ id: request.auth.credentials.profile.raw.id })
            .exec(function(err, user){
              if (err) {
                console.log(err);
              }
              done(null, user);
            });
        } else {
          done(null, false);
        }
      }
    ]
  }
};

/* Updates user data */
exports.update = {
  handler: {
    waterfall: [
      // get user data
      function(request, done) {
        var User = request.server.plugins.db.User;
        User
          .findOne({ id: request.auth.credentials.profile.raw.id })
          .exec(function(err, user){
            if (err) {
              console.log(err);
            }
            user.name = request.payload.name;
            user.color = request.payload.color;
            user.save(function(err, updatedUser){
              if (err) {
                return done(Hapi.error.internal('update user', err));
              }
              done(null, user);
            });
          });
      }
    ]
  }
}

/* Counts and updates a user's total correct guesses */
exports.tallies = {
  handler: {
    waterfall: [
      // get user data
      function(request, done) {
        var User = request.server.plugins.db.User;
        User
          .find()
          .exec(function(err, users){
            if (err) {
              console.log(err);
            }
            var userTallies = [];
            async.each(users, function(user, cb){
              var userData = {
                name: user.name,
                tally: user.correct,
                id: user.id,
                color: user.color
              };
              userTallies.push(userData);
              cb();
            }, function(){
              var sortedTallies = _.sortBy(userTallies, function(user){
                return -user.tally;
              });
              done(null, sortedTallies);
            });
          });
      }
    ]
  }
}
