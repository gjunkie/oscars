var _ = require('lodash-node');
var Handlebars = require('handlebars');
var fs = require('fs');
var path = require('path');
require('handlebars-layouts')(Handlebars);

module.exports = function(plugin) {

  //view engine
  plugin.views({
    engines: { 
      html: Handlebars
    },
    path: path.join(__dirname, '../public/pages'),
    //path: '../public/pages',
    isCached: (plugin.app.env == 'prod'),
    //partialsPath: './modules',
    helpersPath: __dirname + '/helpers'
  });

  console.log('in views'); 
  /*
  var layouts = ['layout', 'modal'];
  layouts.forEach(function(layout) {
    var src = fs.readFileSync(path.resolve(__dirname, '../public/common/'+layout+'.html'), 'utf8');
    Handlebars.registerPartial(layout, src);
  });
  */

  plugin.ext('onPreResponse', function(request, reply) {
    var response = request.response;
    var path = request.path;
    console.log(response); 

    if (response.variety === 'view') { 
      var config = request.server.app.config;

      var context = response.source.context || {};
      var assetName = context.assetName;
      if (!assetName) {
        context.cssAssetName = false;
        context.jsAssetName = false;
      } else if (typeof assetName === 'string') {
        context.cssAssetName = assetName;
        context.jsAssetName = assetName;
      } else {
        context.cssAssetName = assetName.css;
        context.jsAssetName = assetName.js;
      }

      response.source.context = context;

    }
    reply();

  });

};
