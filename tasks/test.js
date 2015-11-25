"use strict";

var SiteBuilder = require("../index");
var nodetree = require("nodetree");
var path = require("path");

module.exports = function(gulp, depends) {
  var rootDir = path.resolve("./test");
  gulp.task("test", depends, function() {


    return new Promise(function(reject, resolve) {
      var site = new SiteBuilder({
        root: rootDir,
        source: "src"
      });
      site.build().then(reject, function() {
        nodetree(path.join(rootDir, site.config.dest));
        resolve();
      });
    });
  });
};
