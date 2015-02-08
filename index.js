var Hapi = require('hapi');
var mongo = require('mongodb');

var server = new Hapi.Server()

server.connection( { port: 8004 } )

server.register([

  { register: require('bell') },
  { register: require('hapi-auth-cookie') },
  { register: require('./app/www') },
  { register: require('./app/api') },
  { register: require('./app/db'), options: { url: process.env.MONGO_URL || 'mongodb://localhost:27017/oscars' }}

], function(err) {

  if (err) {
    throw err;
  }

  server.auth.strategy('google', 'bell', {
    provider: 'google',
    password: 'password',
    isSecure: false,
    clientId: '',
    clientSecret: '',
    providerParams: {
      redirect_uri: server.info.uri + '/login'
    }
  });

  server.auth.strategy('session', 'cookie', 'try', {
    password: 'cookie_encryption_password',
    cookie: 'fa-sid',
    redirectTo: '/login',
    isSecure: false
  });

  server.route({
    method: '*',
    path: '/login',
    config: {
      auth: 'google',
      plugins: {
        'hapi-auth-cookie': {
          redirectTo: false
        }
      },
      handler: function (request, reply) {
        request.auth.credentials.timestamp = new Date();
        request.auth.session.set(request.auth.credentials);
        request.server.plugins.api.get(request, '/api/user/login', function(response){
          return reply.redirect('/');
        });
      }
    }
  });

  server.start();

});
