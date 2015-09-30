'use strict';

var gulp 	  	= require('gulp'),
	sass 	  	= require('gulp-sass'),
	rename 		= require("gulp-rename"),
	notify 		= require("gulp-notify"),
	prefix		= require('gulp-autoprefixer'),
	minifyCSS 	= require('gulp-minify-css'),
	livereload  = require('gulp-livereload'),
	connect 	= require('gulp-connect'),
	jade 		= require('gulp-jade');

// CSS
gulp.task('css', function () {
  gulp.src('app/scss/*.scss')
  	.pipe(prefix('last 15 versions'))
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCSS())
    .pipe(rename('samurai.min.css'))
    .pipe(gulp.dest('dist/css/'))
    .pipe(connect.reload())
    .pipe(notify('Success Build!'));
});

// Watcher
gulp.task('watch', function () {
  gulp.watch('app/scss/*.scss', ['css'])
  gulp.watch('app/*.jade', ['html'])
});

// HTML
gulp.task('html', function (){
	gulp.src('app/*.jade')
	 .pipe(jade())
	 .pipe(gulp.dest('dist/'))
	 .pipe(connect.reload())
});

// LiveReload Server
gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});

// default
gulp.task('default', ['connect', 'html', 'css' ,'watch']);
