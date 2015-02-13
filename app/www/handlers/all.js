
exports.homepage = {
  handler: {
    apiView: {
      requests: [
        {
          variable: 'user',
          url: function(request) {
            return '/api/user';
          }
        }
        {
          variable: 'categories',
          url: function(request) {
            return '/api/categories';
          }
        },
      before: function(request, reply, data) {
        if (!data.categories.length) {
          console.log('we dont have cats');
          return reply.redirect('/setup');
        }
      },
      ],
      view: 'index'
    }
  }
};

exports.setup = {
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
          console.log('we have cats');
          return reply.redirect('/');
        }
      }
    }
  }
};

exports.add = {
  handler: {
    apiView: {
      requests: [
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

exports.actors = {
  handler: {
    apiView: {
      requests: [
        {
          variable: 'actors',
          url: function(request) {
            return '/api/actors';
          }
        }
      ],
      view: 'actors'
    }
  }
};
