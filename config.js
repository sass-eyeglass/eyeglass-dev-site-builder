"use strict";

var merge = require("lodash.merge");

var config = {
  site: {
    themeColor: "#ff0000", // TODO
    title: "Eyeglass",
    tagline: "NPM Modules for Sass",
    description: "TODO",
    styles: ["default.css"],
    scripts: ["default.js"],
    copyright: {
      holder: "Who?", // TODO
      year: new Date().getFullYear(),
      website: "http://sass-lang.com/" // ?
    },
    feed: ["examples"],
    url: "",
    git: {
      account: "sass-eyeglass",
      repo: "eyeglass"
    },
    package: {
      name: "eyeglass"
    },
    badges: "//img.shields.io",

    // TODO - nav
    nav: {
      documentation: {
        href: "documentation",
        title: "Docs",
        description: "Read the docs!"
      },
      github: {
        href: "github",
        title: "GitHub",
        description: "View the source on GitHub",
        target: "_blank"
      }
    }
  },
  livereload: {
    host: "localhost:35729"
  },
  isProd: false,
  today: Date.now(),
  dest: "./tmp/dist",

  environments: {
    production: {
      site: {
        url: "//eyeglass.rocks",
        nav: {
          examples: null,
          tutorials: null
        }
      },
      isProd: true,
      livereload: false
    },
    staging: {
      site: {
        url: "",
        nav: {
          examples: null,
          tutorials: null
        }
      },
      isProd: true,
      livereload: false
    }
  }
};

module.exports = function(options) {
  options = options || {};
  var newConfig = merge(merge({}, config), options);

  if (options.environment) {
    newConfig = merge(newConfig, (config.environments && config.environments[options.environment]) || {});
  }

  config.isDev = !config.isProd;

  return newConfig;
};
