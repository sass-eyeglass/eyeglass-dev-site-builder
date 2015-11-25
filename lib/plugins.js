"use strict";

var camelCase = require("camelcase");
var glob = require("glob");
var path = require("path");

function loadPkgPlugins() {
  var prefix = /^metalsmith-/;
  var pkg = require("../package.json");
  return Object.keys(pkg.dependencies).reduce(function(plugins, name) {
    if (prefix.test(name)) {
      plugins[camelCase(name.replace(prefix, ""))] = require(name);
    }
    return plugins;
  }, {});
}

module.exports = function(config) {
  var plugins = loadPkgPlugins();
  glob.sync(path.join(__dirname, "/plugins/**/[^_.]*.js")).forEach(function(plugin) {
    var pluginName = camelCase(path.basename(plugin, ".js"));
    plugins[pluginName] = require(path.resolve(plugin));
  });

  return plugins;
};
