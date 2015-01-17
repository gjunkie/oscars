var async = require('async');
var Hapi = require('hapi');

module.exports = function(plugin) {
  plugin.handler('apiView', function(route, options) {
    return function(request, reply) {

      async.map(options.requests, function(apiReq, done) {

        var url = apiReq.url;
        var method = apiReq.method || 'get';
        if (typeof url == 'function') {
          url = url(request);
        }

        if (typeof apiReq.condition == 'function' && !apiReq.condition(request)) {
          return done();
        }

        request.server.plugins.api[method](request, url, function(response) {

          if (response.statusCode != 200) {
            return done(response);
          }

          var result = {
            variable: apiReq.variable,
            value: response.result
          };
          done(null, result);
        });

      }, function(err, results) {

        if (err) {
          var result = err.result;
          var error = Hapi.error.create(result.statusCode, result.message);
          return reply(error);
        }
        var output = {};
        results.forEach(function(result) {
          if (!result || !result.variable) {
            return;
          }
          output[result.variable] = result.value;
        });

        if (options.before) {
          var earlyReply = options.before(request, reply, output);
          if (earlyReply) {
            return;
          }
        }

        output.query = request.query;
        output.params = request.params;
        output.assetName = options.assetName;

        reply.view(options.view, output);

      });

    };
  });
};
