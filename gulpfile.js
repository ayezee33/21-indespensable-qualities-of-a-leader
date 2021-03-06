"use strict";

var gulp = require('gulp'),
  browserSync  = require('browser-sync'),
  concat       = require('gulp-concat'),
  uglify       = require('gulp-uglify'),
  cache        = require ('gulp-cache'),
  rename       = require('gulp-rename'),
  sass         = require('gulp-sass'),
  imagemin     = require('gulp-imagemin'),
  maps         = require('gulp-sourcemaps'),
  plumber      = require('gulp-plumber'),
  autoprefixer = require('gulp-autoprefixer'),
  del          = require('del');


gulp.task("concatScripts", function() {
    return gulp.src([
        'src/js/app.js'
        ])
    .pipe(plumber())
    .pipe(maps.init())
    .pipe(concat('app.js'))
    .pipe(maps.write('./'))
    .pipe(plumber.stop())
    .pipe(gulp.dest('dist/js'));
});

gulp.task("minifyScripts", ["concatScripts"], function() {
  return gulp.src("src/js/app.js")
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(plumber.stop())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*')
  .pipe(imagemin({ progressive: true }))
  .pipe(gulp.dest('dist/img'))
});

gulp.task('sass', function() {
  return gulp.src("src/scss/application.scss")
      .pipe(autoprefixer('last 2 version'))
      .pipe(plumber())
      .pipe(sass())
      .pipe(plumber.stop())
      .pipe(maps.write('./'))
      .pipe(gulp.dest('dist/css'));
});

gulp.task('clean', function() {
  del(['dist', 'css/application.css*', 'js/app*.js*']);
});


gulp.task("build", ['minifyScripts', 'sass' ,'images'], function() {
  return gulp.src(["css/**/*.scss", "js/**/*.js", "img/**", "fonts/**"], { base: './'})
            .pipe(gulp.dest('dist'));
});


// Static Server + watching scss/html files
gulp.task('watch', function() {

    browserSync.init({
        server: "./"
    });

    gulp.watch("src/scss/**/*.scss", ['sass']);
    gulp.watch("src/js/**/*.js", ['minifyScripts']);
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task("default", function() {
  gulp.start('build');
});
