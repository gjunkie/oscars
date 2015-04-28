var Hapi = require('hapi');
var async = require('async');
var _ = require('lodash-node');
var categories = require('../../../data/categories');

/* Sets up initial static categories */
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
            primary: 'Film',
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
                  slug: category.slug,
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

/* Gets all categories and their nominees with populated data */
exports.getCategories = {
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
            var votes = {
              path: 'nominees.votes',
              model: 'User'
            }
            Category.populate(categories, votes, function(err, supercats) {
              var favorites = {
                path: 'nominees.favorites',
                model: 'User'
              }
              Category.populate(supercats, favorites, function(err, finalcats) {
                done(null, request, finalcats);
              });
            });
          });
      },
      // populate a nominee's film if it has one
      function(request, categories, done) {
        var filmOptions = {
          path: 'nominees.film',
          model: 'Film'
        }
        var Category = request.server.plugins.db.Category;
        Category.populate(categories, filmOptions, function(err, cats) {
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
      },
      // populate a nominee's artist if it has one
      function(request, categories, done) {
        var artistOptions = {
          path: 'nominees.artist',
          model: 'Artist'
        }
        var Category = request.server.plugins.db.Category;
        Category.populate(categories, artistOptions, function(err, cats) {
          if (err) {
            return done(Hapi.error.internal('populate artist', err));
          }
          done(null, cats);
        });
      },
    ]
  }
};

/* Gets all categories and their nominees */
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

/* Adds a film and its corresponding artist. 
 * Also creates a new nominee and updates the
 * proper category with the new nominee. 
 */
exports.addFilm = {
  handler: {
    waterfall: [
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
      // find/create film
      function(request, category, done) {
        var Film = request.server.plugins.db.Film;
        var slug = request.payload.title.split(' ').join('-').toLowerCase()
        slug = slug.replace(/,/g, "");
        var filmData = {
          title: request.payload.title,
          slug: slug,
          nominations: category
        }
        Film
          .findOne({ title: request.payload.title })
          .exec(function(err, film){
            if (err) {
              return done(Hapi.error.internal('find film', err));
            }
            if (!film) {
              Film.create(filmData, function(err, newFilm) {
                if (err) {
                  return done(Hapi.error.internal('create film', err));
                }
                done(null, request, category, newFilm);
              });
            } else {
              done(null, request, category, film);
            }
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
              var slug = request.payload.director.split(' ').join('-').toLowerCase()
              slug = slug.replace(/,/g, "");
              artistData = {
                name: request.payload.director,
                slug: slug
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
        var slug = film.title.split(' ').join('-').toLowerCase(),
        slug = slug.replace(/,/g, "");
        var nomineeData = {
          name: film.title,
          slug: slug,
          category: category.name,
          type: 'film',
          film: film
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
        category.slots--;
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

/* Adds an artist and its corresponding film. 
 * Also creates a new nominee and updates the
 * proper category with the new nominee. 
 */
exports.addArtist = {
  handler: {
    waterfall: [
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
      // find/create film
      function(request, category, done) {
        var Film = request.server.plugins.db.Film;
        Film
          .findOne({ title: request.payload.title })
          .exec(function(err, film){
            if (err) {
              return done(Hapi.error.internal('find film', err));
            }
            if (!film) {
              var slug = request.payload.title.split(' ').join('-').toLowerCase()
              slug = slug.replace(/,/g, "");
              var filmData = {
                title: request.payload.title,
                slug: slug 
              }
              Film.create(filmData, function(err, newFilm) {
                if (err) {
                  return done(Hapi.error.internal('create film', err));
                }
                newFilm.nominations.push(category.name);
                newFilm.save(function(err, updatedFilm){
                  if (err) {
                    return done(Hapi.error.internal('update film', err));
                  }
                  done(null, request, updatedFilm, category);
                });
              });
            } else {
              // update found film here
              done(null, request, film, category);
            }
          });
      },
      // create artist
      function(request, film, category, done) {
        var Artist = request.server.plugins.db.Artist;
        Artist
          .findOne({ name: request.payload.name })
          .exec(function(err, artist){
            if (!artist) {
              var slug = request.payload.name.split(' ').join('-').toLowerCase(),
              slug = slug.replace(/,/g, "");
              var artistData = {
                name: request.payload.name,
                slug: slug,
              }
              Artist.create(artistData, function(err, newArtist) {
                if (err) {
                  return done(Hapi.error.internal('create artist', err));
                }
                done(null, request, film, newArtist, category);
              });
            } else {
              done(null, request, film, artist, category);
            }
          });
      },
      // add nominations to artist
      function(request, film, artist, category, done) {
        var slug = request.payload.category.split(' ').join('-').toLowerCase(),
        slug = slug.replace(/,/g, "");
        var nominationData = {
          category: request.payload.category,
          slug: slug,
          film: film
        }
        artist.nominations.push(nominationData);
        artist.save(function(err, updatedArtist){
          if (err) {
            return done(Hapi.error.internal('save artist', err));
          }
          done(null, request, film, artist, category);
        });
      },
      // create nominee
      function(request, film, artist, category, done) {
        var Nominee = request.server.plugins.db.Nominee;
        var slug = artist.name.split(' ').join('-').toLowerCase(),
        slug = slug.replace(/,/g, "");
        var nomineeData = {
          name: artist.name,
          slug: slug,
          category: category.name,
          type: 'artist',
          artist: artist,
          film: film
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
        category.slots--;
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

/* Adds or changes a user's vote for a particular category */
exports.vote = {
  handler: {
    waterfall: [
      // find user
      function(request, done) {
        var User = request.server.plugins.db.User;
        User
          .findOne({ id: request.auth.credentials.profile.raw.id })
          .exec(function(err, user){
            if (err) {
              return done(Hapi.error.internal('find user', err));
            }
            done(null, request, user);
          });
      },
      // remove vote from previously voted nominees
      function(request, user, done) {
        var Category = request.server.plugins.db.Category;
        Category
          .findOne({ name: request.payload.category })
          .populate('nominees')
          .exec(function(err, category) {
            var votes = {
              path: 'nominees.votes',
              model: 'User'
            }
            Category.populate(category, votes, function(err, subcategory) {
              async.each(subcategory.nominees, function(nominee, cb) {
                var userIds = {}
                var users = [user];
                users.forEach(function(u){
                  userIds[u.id] = u;
                });

                // Return all elements in A, unless in B
                var cleanVotes = nominee.votes.filter(function(vote){
                    return !(vote.id in userIds);
                });

                nominee.votes = cleanVotes;
                nominee.save(function(err, updatedNominee){
                  if (err) {
                    return done(Hapi.error.internal('save nominee', err));
                  }
                  cb();
                });
              }, function(err) {
                done(null, request, user);
              });
            });
          });
      },
      // find selected nominee and add vote
      function(request, user, done) {
        var Nominee = request.server.plugins.db.Nominee;
        Nominee
          .findOne({
            category: request.payload.category,
            name: request.payload.name
          })
          .exec(function(err, nominee){
            if (err) {
              return done(Hapi.error.internal('find nominee', err));
            }
            nominee.votes.push(user);
            nominee.save(function(err, updatedNominee){
              if (err) {
                return done(Hapi.error.internal('save nominee', err));
              }
              done(null, updatedNominee);
            });
          });
      },
    ]
  }
};

/* Adds or changes a user's favorite for a particular category */
exports.favorite = {
  handler: {
    waterfall: [
      // find user
      function(request, done) {
        var User = request.server.plugins.db.User;
        User
          .findOne({ id: request.auth.credentials.profile.raw.id })
          .exec(function(err, user){
            if (err) {
              return done(Hapi.error.internal('find user', err));
            }
            done(null, request, user);
          });
      },
      // remove favorite from previously favorited nominees
      function(request, user, done) {
        var Category = request.server.plugins.db.Category;
        Category
          .findOne({ name: request.payload.category })
          .populate('nominees')
          .exec(function(err, category) {
            var favorites = {
              path: 'nominees.favorites',
              model: 'User'
            }
            Category.populate(category, favorites, function(err, subcategory) {
              async.each(subcategory.nominees, function(nominee, cb) {
                var userIds = {}
                var users = [user];
                users.forEach(function(u){
                  userIds[u.id] = u;
                });

                // Return all elements in A, unless in B
                var cleanFavorites = nominee.favorites.filter(function(favorite){
                    return !(favorite.id in userIds);
                });
                nominee.favorites = cleanFavorites;
                nominee.save(function(err, updatedNominee){
                  if (err) {
                    return done(Hapi.error.internal('save nominee', err));
                  }
                  cb();
                });
              }, function(err) {
                done(null, request, user);
              });
            });
          });
      },
      // find selected nominee and add favorite
      function(request, user, done) {
        var Nominee = request.server.plugins.db.Nominee;
        Nominee
          .findOne({
            category: request.payload.category,
            name: request.payload.name
          })
          .exec(function(err, nominee){
            if (err) {
              return done(Hapi.error.internal('find nominee', err));
            }
            nominee.favorites.push(user);
            nominee.save(function(err, updatedNominee){
              if (err) {
                return done(Hapi.error.internal('save nominee', err));
              }
              done(null, updatedNominee);
            });
          });
      },
    ]
  }
};

/* Marks or changes a nominee as the winner */
exports.winner = {
  handler: {
    waterfall: [
      // find category
      function(request, done) {
        if (!request.auth.isAuthenticated) {
          done(null, false);
        }
        var Category = request.server.plugins.db.Category;
        Category
          .findOne({ name: request.payload.category })
          .populate('nominees')
          .exec(function(err, category){
            if (err) {
              return done(Hapi.error.internal('find category', err));
            }
            done(null, request, category);
          });
      },
      // reset all nominees to be non-winners
      function(request, category, done) {
        async.each(category.nominees, function(nominee, cb) {
          nominee.winner = false;
          nominee.marked = true;
          nominee.save(function(err, updatedNominee){
            if (err) {
              return done(Hapi.error.internal('save nominee', err));
            }
            cb();
          });
        }, function(err) {
          done(null, request, category);
        });
      },
      // mark nominee as the winner
      function(request, category, done) {
        var Nominee = request.server.plugins.db.Nominee;
        Nominee
          .findOne({
            category: request.payload.category,
            name: request.payload.name
          })
          .exec(function(err, nominee){
            nominee.winner = true;
            nominee.save(function(err, updatedNominee){
              if (err) {
                return done(Hapi.error.internal('save nominee', err));
              }
              done(null, request);
            });
          });
      },
      // reset all counts to zero
      function(request, done) {
        var User = request.server.plugins.db.User;
        User
          .find()
          .exec(function(err, users){
            async.each(users, function(user, cb) {
              user.correct = 0;
              user.save(function(err, updatedUser){
                if (err) {
                  return done(Hapi.error.internal('save user', err));
                }
                cb();
              });
            }, function(err) {
              done(null, request);
            });
          });
      },
      // tally correct guesses for everyone
      function(request, done) {
        var Nominee = request.server.plugins.db.Nominee;
        Nominee
          .find()
          .populate('votes')
          .exec(function(err, nominees){
            async.each(nominees, function(nominee, cb) {
              _.map(nominee.votes, function(user){
                if (nominee.winner) {
                  user.correct++;
                  // this will save the user for every correct vote...
                  // should first count total correct, then set value and save
                  user.save(function(err, updatedUser){
                    if (err) {
                      return done(Hapi.error.internal('save user', err));
                    }
                  });
                }
              });
              nominee.save(function(err, updatedNominee){
                if (err) {
                  return done(Hapi.error.internal('save nominee', err));
                }
                cb();
              });
            }, function(err) {
              done(null);
            });
          });
      }
    ]
  }
};

/* Clears a category to have no marked winner */
exports.clearWinner = {
  handler: {
    waterfall: [
      // find category
      function(request, done) {
        var Category = request.server.plugins.db.Category;
        Category
          .findOne({ slug: request.payload.category })
          .populate('nominees')
          .exec(function(err, category){
            if (err) {
              return done(Hapi.error.internal('find category', err));
            }
            done(null, request, category);
          });
      },
      // reset all nominees to be non-winners
      function(request, category, done) {
        async.each(category.nominees, function(nominee, cb) {
          nominee.winner = false;
          nominee.marked = false;
          nominee.save(function(err, updatedNominee){
            if (err) {
              console.log(err);
            }
            cb();
          });
        }, function(err) {
          done(null, request);
        });
      },
      // reset all counts to zero
      function(request, done) {
        var User = request.server.plugins.db.User;
        User
          .find()
          .exec(function(err, users){
            async.each(users, function(user, cb) {
              user.correct = 0;
              user.save(function(err, updatedUser){
                if (err) {
                  return done(Hapi.error.internal('save user', err));
                }
                cb();
              });
            }, function(err) {
              done(null, request);
            });
          });
      },
      // tally correct guesses for everyone
      function(request, done) {
        var Nominee = request.server.plugins.db.Nominee;
        Nominee
          .find()
          .populate('votes')
          .exec(function(err, nominees){
            async.each(nominees, function(nominee, cb) {
              _.map(nominee.votes, function(user){
                if (nominee.winner) {
                  user.correct++;
                  // this will save the user for every correct vote...
                  // should first count total correct, then set value and save
                  user.save(function(err, updatedUser){
                    if (err) {
                      console.log(err);
                    }
                  });
                }
              });
              nominee.save(function(err, updatedNominee){
                if (err) {
                  console.log(err);
                }
                cb();
              });
            }, function(err) {
              done(null, true);
            });
          });
      }
    ]
  }
};

/* Edit a film's name or associated director */
exports.editFilm = {
  handler: {
    waterfall: [
      // update nominee
      function(request, done) {
        var Nominee = request.server.plugins.db.Nominee;
        Nominee
          .findOne({
            _id: request.payload._nomId
          })
          .exec(function(err, nominee) {
            nominee.title = request.payload.title;
            nominee.slug = request.payload.title.split(' ').join('-').toLowerCase();
            nominee.slug = nominee.slug.replace(/,/g, "");
            nominee.save(function(err, updatedNominee){
              if (err) {
                return done(Hapi.error.internal('save nominee', err));
              }
              done(null, request);
            });
          })
      },
      //update film
      function(request, done) {
        var Film = request.server.plugins.db.Film;
        Film
          .findOne({
            _id: request.payload._id
          })
          .exec(function(err, film) {
            film.title = request.payload.title;
            film.slug = request.payload.title.split(' ').join('-').toLowerCase();
            film.slug = film.slug.replace(/,/g, "");
            film.save(function(err, updatedFilm) {
              if (err) {
                return done(Hapi.error.internal('save film', err));
              }
              done(null, request);
            });
          });
      },
      //update director
      function(request, done) {
        var Artist = request.server.plugins.db.Artist;
        Artist
          .findOne({
            _id: request.payload._artistId
          })
          .exec(function(err, artist) {
            artist.name = request.payload.director;
            artist.slug = request.payload.director.split(' ').join('-').toLowerCase();
            artist.slug = artist.slug.replace(/,/g, "");
            artist.save(function(err, updatedArtist){
              if (err) {
                return done(Hapi.error.internal('save artist', err));
              }
              done(null);
            });
          });
      }
    ]
  }
}

/* Edit an artist's name or associated film */
exports.editArtist= {
  handler: {
    waterfall: [
      // update nominee
      function(request, done) {
        var Nominee = request.server.plugins.db.Nominee;
        Nominee
          .findOne({
            _id: request.payload._nomId
          })
          .exec(function(err, nominee) {
            nominee.name = request.payload.name;
            nominee.slug = request.payload.name.split(' ').join('-').toLowerCase();
            nominee.slug = nominee.slug.replace(/,/g, "");
            nominee.save(function(err, updatedNominee){
              if (err) {
                return done(Hapi.error.internal('save nominee', err));
              }
              done(null, request);
            });
          })
      },
      //update artist
      function(request, done) {
        var Artist = request.server.plugins.db.Artist;
        Artist
          .findOne({
            _id: request.payload._id
          })
          .exec(function(err, artist) {
            artist.name = request.payload.name;
            artist.slug = request.payload.name.split(' ').join('-').toLowerCase();
            artist.slug = artist.slug.replace(/,/g, "");
            artist.save(function(err, updatedArtist) {
              if (err) {
                return done(Hapi.error.internal('save artist', err));
              }
              done(null, request);
            });
          });
      },
      //update film
      function(request, done) {
        var Film = request.server.plugins.db.Film;
        Film
          .findOne({
            _id: request.payload._filmId
          })
          .exec(function(err, film) {
            film.title = request.payload.title;
            film.slug = request.payload.title.split(' ').join('-').toLowerCase();
            film.slug = film.slug.replace(/,/g, "");
            film.save(function(err, updatedFilm){
              if (err) {
                return done(Hapi.error.internal('save film', err));
              }
              done(null);
            });
          });
      }
    ]
  }
}
