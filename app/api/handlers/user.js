var async = require('async');

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

exports.user = {
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
              done(null, 'error');
            }
            done(null, user);
          });
      }
    ]
  }
};

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
              done(null, userTallies);
            });
          });
      }
    ]
  }
}
