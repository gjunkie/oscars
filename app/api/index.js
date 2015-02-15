var handlers = require('./handlers/all');
var user = require('./handlers/user');
var waterfallHandler = require('./lib/waterfall-handler');

exports.register = function(plugin, options, next) {

  waterfallHandler(plugin);

  plugin.route([

    //get
    { method: 'GET', path: '/api/user', config: user.user },
    { method: 'GET', path: '/api/user/login', config: user.login },
    { method: 'GET', path: '/api/user/tallies', config: user.tallies },
    { method: 'GET', path: '/api/categories', config: handlers.getCategories },
    { method: 'GET', path: '/api/setup', config: handlers.setUpCategories },

    //post
    { method: 'POST', path: '/api/add/film', config: handlers.addFilm },
    { method: 'POST', path: '/api/add/artist', config: handlers.addArtist },
    { method: 'POST', path: '/api/winner', config: handlers.winner },
    { method: 'POST', path: '/api/vote', config: handlers.vote },
    { method: 'POST', path: '/api/edit/film', config: handlers.editFilm },
    { method: 'POST', path: '/api/edit/artist', config: handlers.editArtist },
    { method: 'POST', path: '/api/favorite', config: handlers.favorite },
    { method: 'POST', path: '/api/update/profile', config: user.update },
    //{ method: 'POST', path: '/api/add/path/{var}', config: handlers.function },

  ]);

  var server = plugin.connections[0];

  plugin.expose('get', function(request, url, callback) {
    server.inject({
      method: 'GET',
      url: url,
      headers: {
        cookie: (request.headers) ? request.headers.cookie : false
      },
      credentials: request.auth.credentials || null
    }, callback);
  });

  plugin.expose('post', function(request, url, data, callback) {
    server.inject({
      method: 'POST',
      url: url,
      payload: data,
      headers: {
        cookie: (request.headers) ? request.headers.cookie : false
      },
      credentials: request.auth.credentials.creds || null
    }, callback);
  });

  next();

};

exports.register.attributes = {
  name: 'api'
};
