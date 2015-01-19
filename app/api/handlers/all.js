var async = require('async');

exports.setUpCategories = {
  handler: {
    waterfall: [
      function(request, done) {

        var categories = [
          'Best Picture',
          'Actor',
          'Actress',
          'Supporting Actor',
          'Supporting Actress',
          'Animated Feature Film',
          'Cinematography',
          'Costume Design',
          'Directing',
          'Documentary Feature',
          'Documentary Short Subject',
          'Film Editing',
          'Foreign Language Film',
          'Makeup and Hairstyling',
          'Original Score',
          'Original Song',
          'Production Design',
          'Animated Short Film',
          'Short Film',
          'Sound Editing',
          'Sound Mixing',
          'Visual Effects',
          'Adapted Screenplay',
          'Original Screenplay',
        ]

        var allNominations = [];

        var Nomination = request.server.plugins.db.Nomination;
        async.each(categories, function(category, cb){
          Nomination
            .findOne({ category: category })
            .exec(function(err, nomination){
              if (err) {
                return done(Hapi.error.internal('find nomination', err));
              }
              if (!nomination) {
                var nominationData = {
                  category: category,
                }
                Nomination.create(nominationData, function(err, newNomination) {
                  if (err) {
                    return done(Hapi.error.internal('create nomination', err));
                  }
                  allNominations.push(newNomination);
                  cb()
                });
              } else {
                cb();
              }
            });
        }, function(err){
          if (err) {
            return done(Hapi.error.internal('create each nomination', err));
          }
          done(null, allNominations);
        });
      }
    ]
  }
};

exports.getCategories = {
  handler: {
    waterfall: [
      function(request, done) {
        var Nomination = request.server.plugins.db.Nomination;
        Nomination
          .find({})
          .exec(function(err, nominations){
            if (err) {
              return done(Hapi.error.internal('find nominations', err));
            }
            done(null, request, nominations);
          });
      },
      function(request, nominations, done) {
        done(null, nominations);
      }
    ]
  }
};

exports.newUser = {
  handler: {
    waterfall: [
      // create user
      function(request, done) {

        // logic to create user

        done(null, 'user');
      }
    ]
  }
};

exports.addFilm = {
  handler: {
    waterfall: [
      // create user
      function(request, done) {

        console.log('film added');

        done(null, 'good');
      }
    ]
  }
};
