"use strict";

var gulp = require('gulp'),
	minifyCss = require('gulp-minify-css'),
	rename = require("gulp-rename"),
	autoprefixer = require('gulp-autoprefixer'),
	livereload = require('gulp-livereload'),
	connect = require('gulp-connect'),
	sass = require('gulp-sass'),
	jade = require('gulp-jade'),
	wiredep = require('wiredep').stream,
	useref = require('gulp-useref'),
	uglify = require('gulp-uglify'),
	gulpif = require('gulp-if'),
	notify = require("gulp-notify"),
	clean = require('gulp-clean');

//clean folder
gulp.task('clean', function () {
    return gulp.src('./build', {read: false})
        .pipe(clean());
});

//build project
gulp.task('build', ['clean'], function () {
    var assets = useref.assets();
    
    return gulp.src('dist/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('./build'));
});

//wiredep
gulp.task('bower', function () {
  gulp.src('./dist/*.html')
    .pipe(wiredep({
      directory : "./dist/bower_components"
    }))
    .pipe(gulp.dest('./dist'));
});

//livereload
gulp.task('connect', function () {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

//html
gulp.task('html', function(){
  return gulp.src('jade/**/*.jade')
    .pipe(jade({'pretty': true}))
    .pipe(wiredep({
      directory : "./dist/bower_components"
     }))
    .pipe(gulp.dest('dist'))
    .pipe(notify('html DONE!'))
	.pipe(connect.reload())
});

//css
gulp.task('css', function() {
	return gulp.src('scss/*.scss')
	.pipe(sass())
	.pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
    .pipe(minifyCss())
	.pipe(rename('style.min.css'))
    .pipe(gulp.dest('dist/css'))
	.pipe(notify('css DONE!'))
	.pipe(connect.reload())
});

//watch
gulp.task('watch', function () {
    gulp.watch('scss/*.scss', ['css']),
	gulp.watch('jade/**/*.jade', ['html']),
	gulp.watch('bower.json', ['bower']);
})

//default
gulp.task('default', ['connect', 'html', 'css', 'bower', 'watch']);