var _ = require('lodash-node');
var fs = require('fs');
var path = require('path');
var Handlebars = require('handlebars');
var engine = Handlebars.create();
var layouts = require('handlebars-layouts')
layouts.register(engine);

module.exports = function(plugin) {

  // view engine
  plugin.views({
    engines: { html: engine },
    path: path.resolve(__dirname, '../public/pages'),
    partialsPath: path.resolve(__dirname, '../public/pages'),
    helpersPath: __dirname + '/helpers',
    isCached: false
  });

  var src = fs.readFileSync(path.resolve(__dirname, '../public/pages/layout.html'), 'utf8');
  Handlebars.registerPartial('layout', src);

};
