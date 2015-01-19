var Hapi = require('hapi');
var mongo = require('mongodb');

var server = new Hapi.Server()

server.connection( { port: 8004 } )

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
