
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
              return done(Hapi.error.internal('find user', err));
            }
            if (!user) {
              var userData = {
                id: request.auth.credentials.profile.raw.id,
                name: request.auth.credentials.profile.raw.given_name,
                email: request.auth.credentials.profile.raw.email
              }
              User.create(userData, function(err, newUser) {
                if (err) {
                  console.log(err);
                }
                done(null, request, newUser);
              });
            } else {
              // TODO: should prob update the user if they exist
              done(null, request, user);
            }
          });
      }
    ]
  }
};
