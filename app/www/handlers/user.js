
/* Voting page */
exports.vote = {
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
      before: function(request, reply, data) {
        var date = new Date();
        var deadline = new Date('Sun Feb 26 2017 17:45:00 GMT-0800 (PST)');
        if (date > deadline) {
          return reply.redirect('/');
        }
      },
      view: 'vote'
    }
  }
};

/* User profile page */
exports.profile = {
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
        }
      ],
      view: 'profile'
    }
  }
};

/* User logout */
exports.logout = {
  handler: {
    apiView: {
      requests: [
      ],
      before: function(request, reply, data) {
        request.auth.session.clear();
        return reply.redirect('/');
      },
      view: ''
    }
  }
};
