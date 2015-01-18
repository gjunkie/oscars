var http = require('http');
var Hapi = require('hapi');
var Handlebars = require('handlebars');
var mongo = require('mongodb');
var engine = Handlebars.create();

var server = new Hapi.Server()

server.connection( { port: 8004 } )

server.views({
  engines: { html: engine },
  path: __dirname + '/app/www/public/pages',
  helpersPath: __dirname + '/app/www/lib/helpers',
  isCached: false
});

server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
        directory: {
            path: 'dist'
        }
    }
});

server.register([

    { register: require('./app/www') },
    { register: require('./app/api') },
    { register: require('./app/db'), options: { url: process.env.MONGO_URL || 'mongodb://localhost:27017/oscars' }}

], function(err) {
  if (err) {
    throw err;
  }

  server.start();
});
