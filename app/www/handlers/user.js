
exports.vote = {
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
        var deadline = new Date('Wed Feb 22 2015 17:00:00 GMT-0800 (PST)');
        if (date > deadline) {
          return reply.redirect('/');
        }
      },
      view: 'vote'
    }
  }
};

exports.profile = {
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
      before: function(request, reply, data) {
        if (!data.user) {
          return reply.redirect('/login');
        }
      },
      view: 'profile'
    }
  }
};

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
