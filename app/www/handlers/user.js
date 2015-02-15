
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
