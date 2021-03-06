/* global require */

var gulp = require("gulp");
var watch = require("gulp-watch");
var prefixer = require("gulp-autoprefixer");
var uglify = require("gulp-uglify");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var rigger = require("gulp-rigger");
var cssmin = require("gulp-minify-css");
var imagemin = require("gulp-imagemin");
var pngquant = require("imagemin-pngquant");
var rimraf = require("rimraf");
var browserSync = require("browser-sync");

var reload = browserSync.reload;
var task = gulp.task.bind(gulp);
var src = gulp.src.bind(gulp);
var dest = gulp.dest.bind(gulp);
var start = gulp.start.bind(gulp);
var path = {
  build: {
    html: "build/html",
    js: "build/js/",
    css: "build/css/",
    img: "build/img"
  },
  src: {
    html: "src/html/*.html",
    js: "src/js/*.js",
    css: "src/css/**/*.css",
    img: "src/img/**/*.*"
  },
  watch: {
    html: "src/html/**/*.html",
    js: "src/js/**/*.js",
    css: "src/css/**/*.css",
    img: "src/img/**/*.*"
  },
  clean: "./build"
};
var config = {
  server: {
    baseDir: "build/",
    index: "html/service.html"
  },
  tunnel: true,
  host: "localhost",
  port: 9000,
  logPrefix: "Besomhead-T05"
};
var reloadConfig = {
  stream: true
};

task("html:build", function htmlBuild() {
  src(path.src.html)
    .pipe(rigger())
    .pipe(dest(path.build.html))
    .pipe(reload(reloadConfig));
});
task("js:build", function jsBuild() {
  src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(dest(path.build.js))
    .pipe(reload(reloadConfig));
});
task("css:build", function cssBuild() {
  src(path.src.css)
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(prefixer())
    .pipe(cssmin())
    .pipe(sourcemaps.write())
    .pipe(dest(path.build.css))
    .pipe(reload(reloadConfig));
});
task("image:build", function imgBuild() {
  src(path.src.img)
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()],
        interlaced: true
      })
    )
    .pipe(dest(path.build.img))
    .pipe(reload(reloadConfig));
});
task("build", ["html:build", "js:build", "css:build", "image:build"]);
task("watch", function watchHTML() {
  watch([path.watch.html], function onHTMLChange() {
    start("html:build");
  });
  watch([path.watch.css], function onCSSChange() {
    start("css:build");
  });
  watch([path.watch.img], function onImageChange() {
    start("image:build");
  });
  watch([path.watch.js], function onJSChange() {
    start("js:build");
  });
});
task("webServer", function runServer() {
  browserSync(config);
});
task("clean", function clean(callback) {
  rimraf(path.clean, callback);
});
task("default", ["build", "webServer", "watch"]);
