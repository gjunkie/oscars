
exports.vote = {
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
            return '/api/user/profile';
          }
        }
      ],
      view: 'profile'
    }
  }
};
