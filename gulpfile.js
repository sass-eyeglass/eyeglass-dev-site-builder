"use strict";

var gulp = require("gulp");

require("./tasks/lint")(gulp);
require("./tasks/depcheck")(gulp, null, {
  root: __dirname
});
require("./tasks/test")(gulp, ["lint", "depcheck"]);

require("./tasks/release")(gulp, ["test"]);
require("./tasks/publish")(gulp, ["test"]);

gulp.task("default", ["test"]);
