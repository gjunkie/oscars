
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
      view: 'index'
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
