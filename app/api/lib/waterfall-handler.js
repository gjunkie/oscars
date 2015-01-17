var async = require('async');
var _ = require('lodash-node');

module.exports = function(plugin) {

  plugin.handler('waterfall', function(route, options) {

    return function(request, reply) {

      var api = {
        db: request.server.plugins.db
      };

      var waterfall = _.map(options, function(call) {
        if (typeof call === 'string') {
          call = helpers[call];
        }
        return call.bind(api);
      });

      waterfall.unshift(function(done) {
        done(null, request);
      });
      async.waterfall(waterfall, function(err, results) {
        if (err) {
          return reply(err);
        }
        return reply(results);
      });

    };

  });
};
