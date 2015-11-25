"use strict";

var configure = require("./config");
var metalsmithBuilder = require("./lib/build");
var merge = require("lodash.merge");

function EyeglassSiteBuilder(config) {
  this.config = configure(config);
}

EyeglassSiteBuilder.prototype.test = function(done) {
  return this.build();
};

EyeglassSiteBuilder.prototype.build = function(config) {
  var site = this.create(config);
  return new Promise(function(reject, resolve) {
    site.build(function(err) {
      if (err) {
        reject(err);
      }
      else {
        resolve();
      }
    });
  });
};

EyeglassSiteBuilder.prototype.create = function(config) {
  config = merge({}, this.config, config);
  return metalsmithBuilder(config);
};

EyeglassSiteBuilder.prototype.serve = function(config) {
  this.build(merge({
    isServer: true,
    environment: "dev"
  }, config));
};

module.exports = EyeglassSiteBuilder;
