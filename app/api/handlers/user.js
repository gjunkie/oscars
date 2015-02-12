
exports.login = {
  handler: {
    waterfall: [
      // create user if first login
      function(request, done) {
        var User = request.server.plugins.db.User;
        User
          .findOne({ id: request.auth.credentials.profile.raw.id })
          .exec(function(err, user){
            console.log('running');
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
              console.log('done 2');
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
            }
            done(null, user);
          });
      }
    ]
  }
}

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
