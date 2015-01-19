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

        var allCategories = [];

        var Category = request.server.plugins.db.Category;
        async.each(categories, function(category, cb){
          Category
            .findOne({ category: category })
            .exec(function(err, foundCategory){
              if (err) {
                return done(Hapi.error.internal('find category', err));
              }
              if (!foundCategory) {
                var categoryData = {
                  category: category,
                }
                Category.create(categoryData, function(err, newCategory) {
                  if (err) {
                    return done(Hapi.error.internal('create category', err));
                  }
                  allCategories.push(newCategory);
                  cb()
                });
              } else {
                cb();
              }
            });
        }, function(err){
          if (err) {
            return done(Hapi.error.internal('create each category', err));
          }
          done(null, allCategories);
        });
      }
    ]
  }
};

exports.getCategories = {
  handler: {
    waterfall: [
      function(request, done) {
        var Category = request.server.plugins.db.Category;
        Category
          .find({})
          .exec(function(err, categories){
            if (err) {
              return done(Hapi.error.internal('find categories', err));
            }
            done(null, request, categories);
          });
      },
      function(request, categories, done) {
        done(null, categories);
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
      // find film
      function(request, done) {
        var Film = request.server.plugins.db.Film;
        Film
          .findOne({ title: request.payload.title })
          .exec(function(err, film){
            if (err) {
              return done(Hapi.error.internal('find film', err));
            }
            if (!film) {
              done(null, request);
            } else {
              done(null, film);
            }
          });
      },
      // find category
      function(request, done) {
        var Category = request.server.plugins.db.Category;
        Category
          .findOne({ category: request.payload.category })
          .exec(function(err, category){
            if (err) {
              return done(Hapi.error.internal('find category', err));
            }
            done(null, request, category);
          });
      },
      // create film
      function(request, category, done) {
        var Film = request.server.plugins.db.Film;
        var filmData = {
          title: request.payload.title,
          nominations: category
        }
        Film.create(filmData, function(err, newFilm) {
          if (err) {
            return done(Hapi.error.internal('create film', err));
          }
          done(null, request, category, newFilm);
        });
      },
      // update category
      function(request, category, film, done) {
        category.nominees.push(film);
        category.save(function(err, updatedCategory){
          if (err) {
            return done(Hapi.error.internal('save category', err));
          }
          done(null, updatedCategory);
        });
      }
    ]
  }
};
