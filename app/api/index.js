var handlers = require('./handlers/all');
var waterfallHandler = require('./lib/waterfall-handler');

exports.register = function(plugin, options, next) {

  waterfallHandler(plugin);

  plugin.route([

    //get
    { method: 'GET', path: '/api/categories', config: handlers.getCategories },
    { method: 'GET', path: '/api/setup', config: handlers.setUpCategories },
    { method: 'GET', path: '/api/actors', config: handlers.actors },

    //post
    { method: 'POST', path: '/api/add/film', config: handlers.addFilm },
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
