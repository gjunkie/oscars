
/* Homepage data */
exports.homepage = {
  handler: {
    apiView: {
      requests: [
        {
          variable: 'user',
          url: function(request) {
            return '/api/user';
          }
        },
        {
          variable: 'categories',
          url: function(request) {
            return '/api/categories';
          }
        },
      ],
      before: function(request, reply, data) {
        if (!data.categories.length) {
          return reply.redirect('/setup');
        }
      },
      view: 'index'
    }
  }
};

/* Set up page for inital app load. */
exports.setup = {
  plugins: {
    'hapi-auth-cookie': {
      redirectTo: '/login'
    }
  },
  handler: {
    apiView: {
      requests: [
        {
          variable: 'categories',
          url: function(request) {
            return '/api/setup';
          }
        }
      ],
      before: function(request, reply, data) {
        if (data.categories.length) {
          return reply.redirect('/');
        }
      }
    }
  }
};

/* Add nominees page */
exports.add = {
  plugins: {
    'hapi-auth-cookie': {
      redirectTo: '/login'
    }
  },
  handler: {
    apiView: {
      requests: [
        {
          variable: 'user',
          url: function(request) {
            return '/api/user';
          }
        },
        {
          variable: 'categories',
          url: function(request) {
            return '/api/categories';
          }
        }
      ],
      view: 'add'
    }
  }
};
