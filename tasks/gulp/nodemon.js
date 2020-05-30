"use strict";
const gulp = require("gulp");
const nodemon = require("nodemon");

// Nodemon task --------------------------
// Restarts node app for changes affecting
// js and json files
// ---------------------------------------
gulp.task("nodemon", () => {
  return nodemon({
    script: "app.js",
    watch: [
      "app.js",
      "app/",
      "controllers/",
      "helpers/",
      "loaders/",
      "middleware/",
      "models",
      "routes/",
      "services/"
    ],
    ext: "njk, js"
  });
});
