var views = require('./lib/views');
var path = require('path');
var apiView = require('./lib/api-view');
var handlers = require('./handlers/all');

/*
 * This is where we set up our www routes
 *
 */
exports.register = function(plugin, options, next) {

  views(plugin);
  apiView(plugin);

  plugin.route([
    // assets
    { method: 'GET', path: '/dist/{param*}', handler: {
        directory: {
          path: './dist'
        }
      }
    },
    // pages
    { method: 'GET', path: '/', config: handlers.homepage },
    { method: 'GET', path: '/setup', config: handlers.setup },
    { method: 'GET', path: '/add', config: handlers.add },
    { method: 'GET', path: '/actors', config: handlers.actors },
  ]);

  next();

};

exports.register.attributes = {
  name: 'www'
};
