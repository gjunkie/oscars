var apiView = require('./lib/api-view');
var handlers = require('./handlers/all');

/*
** This is where we set up our www routes
**
*/
exports.register = function(plugin, options, next) {

  apiView(plugin);

  plugin.route([
    { method: 'GET', path: '/', config: handlers.homepage },
    { method: 'GET', path: '/actors', config: handlers.actors },
  ]);

  next();

};

exports.register.attributes = {
  name: 'www'
};
