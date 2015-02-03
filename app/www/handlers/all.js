
exports.homepage = {
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
      before: function(request, reply, data) {
        //console.log(data.categories);
        if (!data.categories.length) {
          console.log('we dont have cats');
          return reply.redirect('/setup');
        }
      },
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
            // this no longer exists!!
            return '/api/categories';
          }
        }
      ],
      before: function(request, reply, data) {
        console.log(data);
      },
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
