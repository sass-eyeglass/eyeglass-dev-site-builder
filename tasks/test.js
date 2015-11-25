"use strict";

var SiteBuilder = require("../index");
var nodetree = require("nodetree");
var path = require("path");

module.exports = function(gulp, depends) {
  var rootDir = "test";
  gulp.task("test", depends, function() {
    var site = new SiteBuilder({
      root: rootDir,
      source: "src"
    });
    var metalsmith = site.create();

    metalsmith.build(function(err) {
      if (err) {
        throw err;
      }
      nodetree(path.join(rootDir, site.config.dest));
    });
  });
};
