
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
