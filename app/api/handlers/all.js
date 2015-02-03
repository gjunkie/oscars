var Hapi = require('hapi');
var async = require('async');
var _ = require('lodash-node');
var categories = require('../../../data/categories');

exports.setUpCategories = {
  handler: {
    waterfall: [
      function(request, done) {

        var allCategories = [];

        var categories = [
          {
            name: 'Best Picture',
            slug: 'best-picture',
            slots: 8,
            primary: 'Film',
            secondary: 'Director'
          },
          {
            name: 'Actor',
            slug: 'actor',
            slots: 5,
            primary: 'Actor',
            secondary: 'Film'
          },
          {
            name: 'Actress',
            slug: 'actress',
            slots: 5,
            primary: 'Actress',
            secondary: 'Film'
          },
          {
            name: 'Supporting Actor',
            slug: 'supporting-actor',
            slots: 5,
            primary: 'Supporting Actor',
            secondary: 'Film'
          },
          {
            name: 'Supporting Actress',
            slug: 'supporting-actress',
            slots: 5,
            primary: 'Supporting Actress',
            secondary: 'Film'
          },
          {
            name: 'Animated Feature Film',
            slug: 'animated-feature-film',
            slots: 5,
            primary: 'Animated Film',
            secondary: 'Director'
          },
          {
            name: 'Cinematography',
            slug: 'cinematography',
            slots: 5,
            primary: 'Cinematographer',
            secondary: 'Film'
          },
          {
            name: 'Costume Design',
            slug: 'costume-design',
            slots: 5,
            primary: 'Designer',
            secondary: 'Film'
          },
          {
            name: 'Directing',
            slug: 'directing',
            slots: 5,
            primary: 'Director',
            secondary: 'Film'
          },
          {
            name: 'Documentary Feature',
            slug: 'documentary-feature',
            slots: 5,
            primary: 'Film',
            secondary: 'Director'
          },
          {
            name: 'Documentary Short Subject',
            slug: 'documentary-short-subject',
            slots: 5,
            primary: 'Film',
            secondary: 'Director'
          },
          {
            name: 'Film Editing',
            slug: 'film-editing',
            slots: 5,
            primary: 'Editor',
            secondary: 'Film'
          },
          {
            name: 'Foreign Language Film',
            slug: 'foreign-language-film',
            slots: 5,
            primary: 'Film',
            secondary: 'Country'
          },
          {
            name: 'Makeup and Hairstyling',
            slug: 'makeup-and-hairstyling',
            slots: 5,
            primary: 'Artist',
            secondary: 'Film'
          },
          {
            name: 'Original Score',
            slug: 'original-score',
            slots: 5,
            primary: 'Composer',
            secondary: 'Film'
          },
          {
            name: 'Original Song',
            slug: 'original-song',
            slots: 5,
            primary: 'Composer',
            secondary: 'Film'
          },
          {
            name: 'Production Design',
            slug: 'production-design',
            slots: 5,
            primary: 'Artist',
            secondary: 'Film'
          },
          {
            name: 'Animated Short Film',
            slug: 'animated-short-film',
            slots: 5,
            primary: 'Film',
            secondary: 'Director'
          },
          {
            name: 'Short Film',
            slug: 'short-film',
            slots: 5,
            primary: 'Film',
            secondary: 'Director'
          },
          {
            name: 'Sound Editing',
            slug: 'sound-editing',
            slots: 5,
            primary: 'Sound Editor',
            secondary: 'Film'
          },
          {
            name: 'Sound Mixing',
            slug: 'sound-mixing',
            slots: 5,
            primary: 'Sound Mixer',
            secondary: 'Film'
          },
          {
            name: 'Visual Effects',
            slug: 'visual-effects',
            slots: 5,
            primary: 'Artist',
            secondary: 'Film'
          },
          {
            name: 'Adapted Screenplay',
            slug: 'adapted-screenplay',
            slots: 5,
            primary: 'Writer',
            secondary: 'Film'
          },
          {
            name: 'Original Screenplay',
            slug: 'original-screenplay',
            slots: 5,
            primary: 'Writer',
            secondary: 'Film'
          }
        ];
        var Category = request.server.plugins.db.Category;
        var count = 0;
        async.each(categories, function(category, cb){
          Category
            .findOne({ category: category.name })
            .exec(function(err, foundCategory){
              if (err) {
                return done(Hapi.error.internal('find category', err));
              }
              if (!foundCategory) {
                var categoryData = {
                  name: category.name,
                  primary: category.primary,
                  secondary: category.secondary,
                  slots: category.slots
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
        var Film = request.server.plugins.db.Film;
        Category
          .find()
          .populate('nominees')
          .exec(function(err, categories){
            if (err) {
              return done(Hapi.error.internal('find categories', err));
            }

            var options = {
              path: 'nominees.film',
              model: 'Film'
            }
            Category.populate(categories, options, function(err, cats) {
              if (err) {
                return done(Hapi.error.internal('populate film', err));
              }
              var options = {
                path: 'nominees.film.director',
                model: 'Artist'
              }
              Category.populate(cats, options, function(err, supercats) {
                done(null, request, supercats);
              });
            });
          });
      },
      function(request, categories, done) {
        var Nominee = request.server.plugins.db.Nominee;
        var prettyCats = [];
        async.each(categories, function(category, callback){
          var type = (category.primary == 'Film') ? 'film director' : 'artist';
          console.log(category.nominees);
          var nomineeGroup = {
            name: category.name,
            primary: category.primary,
            secondary: category.secondary,
            slots: category.slots,
            nominees: category.nominees
          };
          async.each(category.nominees, function(nominee, cb){
            Nominee
              .findOne({ _id: nominee._id })
              .populate(type)
              .exec(function(err, foundNominee){
                nomineeGroup.nominees.push(foundNominee);
                cb();
              })
          });
          callback();
          prettyCats.push(nomineeGroup);
        });
        done(null, prettyCats);
      }
    ]
  }
};

exports.getNominees = {
  handler: {
    waterfall: [
      function(request, done) {
        var Category = request.server.plugins.db.Category;
        Category
          .find()
          .populate('nominees')
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
              return done(Hapi.error.internal('film exists', err));
            }
          });
      },
      // find category
      function(request, done) {
        var Category = request.server.plugins.db.Category;
        Category
          .findOne({ name: request.payload.category })
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
      // create artist
      function(request, category, film, done) {
        var Artist = request.server.plugins.db.Artist;
        Artist
          .findOne({ name: request.payload.director })
          .exec(function(err, artist){
            if (err) {
              return done(Hapi.error.internal('find artist', err));
            }
            if (!artist) {
              artistData = {
                name: request.payload.director
              }
              Artist.create(artistData, function(err, newArtist) {
                if (err) {
                  return done(Hapi.error.internal('create artist', err));
                }
                film.director = newArtist;
                film.save(function(err, updatedFilm){
                  if (err) {
                    return done(Hapi.error.internal('save film', err));
                  }
                  done(null, request, category, updatedFilm);
                });
              });
            } else {
              done(null, request, category, film, artist);
            }
          });
      },
      // create nominee
      function(request, category, film, done) {
        var Nominee = request.server.plugins.db.Nominee;
        var nomineeData = {
          name: request.payload.category,
          film: film,
          nominations: category
        }
        Nominee.create(nomineeData, function(err, newNominee) {
          if (err) {
            return done(Hapi.error.internal('create nominee', err));
          }
          done(null, request, category, newNominee);
        });
      },
      // update category
      function(request, category, nominee, done) {
        category.nominees.push(nominee);
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
