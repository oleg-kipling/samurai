'use strict';
///////////////////////////////////////////////////
// add var paths
///////////////////////////////////////////////////


///////////////////////////////////////////////////
// Required taskes
// gulp build
// bulp build:server
///////////////////////////////////////////////////
var gulp 	  	    = require('gulp'),
    jade          = require('gulp-jade'),
	  sass 	  	    = require('gulp-sass'),
    autoprefixer  = require('gulp-autoprefixer'),
    uglify        = require('gulp-uglify'), 
    flatten       = require('gulp-flatten'),
    browserSync   = require('browser-sync'),
    reload        = browserSync.reload,
    plumber       = require('gulp-plumber'),
    rename 		    = require('gulp-rename'),
    concat        = require('gulp-concat'),
    notify        = require('gulp-notify'),
    del           = require('del');

///////////////////////////////////////////////////
// Markdown Tasks
///////////////////////////////////////////////////
gulp.task('markdown', function () {
  gulp.src('app/jade/index.jade')
   .pipe(plumber())
   .pipe(jade())
   .pipe(gulp.dest('app'))

   .pipe(reload({stream:true}));
});

///////////////////////////////////////////////////
// Styles Tasks
///////////////////////////////////////////////////
gulp.task('styles', function () {
  gulp.src('app/scss/style.scss')
    .pipe(plumber())
      .pipe(sass({outputStyle: 'compressed'})
        .on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false
      }))
    // .pipe(rename('samurai.min.css'))
    .pipe(gulp.dest('app/css'))

    .pipe(reload({stream:true}));
});

///////////////////////////////////////////////////
// JavaScripts Tasks
///////////////////////////////////////////////////
gulp.task('scripts', function() {
  gulp.src('app/js/*.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename('samurai.min.js'))
    .pipe(gulp.dest('app/js'))

    .pipe(reload({stream:true}));
});

///////////////////////////////////////////////////
// Bower Tasks
///////////////////////////////////////////////////
gulp.task('bower_scripts', function () {
  gulp.src('app/bower_components/**/*.min.js')
    .pipe(flatten( {includeParents: 1} ))
    // .pipe(uglify())
    // .pipe(rename('vendor.min.js'))
    .pipe(gulp.dest('app/libs'));
});

gulp.task('bower_styles', function () {
  gulp.src(['app/bower_components/**/*.css'])
    .pipe(flatten( { includeParents: 1} ))
    // .pipe(minifyCSS())
    // .pipe(rename('vendor.min.css'))
    .pipe(gulp.dest('app/libs'));
});

///////////////////////////////////////////////////
// Browser-Sync Tasks
///////////////////////////////////////////////////
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./app/"
        }
    });
});

gulp.task('build:server', function() {
    browserSync({
        server: {
            baseDir: "./build/"
        }
    });
});

///////////////////////////////////////////////////
// Build Tasks
///////////////////////////////////////////////////
// clean build folder
gulp.task('build:cleanfolder', function () {
  del(['build/**']);
});

// task to create build directory of all files
gulp.task('build:copy', ['build:cleanfolder'], function(){
    return gulp.src('app/**/*/')
    .pipe(gulp.dest('build/'))
});

// .pipe(notify('Success Build!'));
// task to removed unwanted build files
// list all files and directories here that you don't want included
gulp.task('build:remove', ['build:copy'], function () {
    del([
    'build/scss',
    'build/jade',
    'build/js/!(*.min.js)',
    'build/bower_components',
    'build/libs/normalize-scss',
    'build/libs/normalize-css'
  ]);
});

// gulp build default
gulp.task('build', ['build:copy', 'build:remove']);

///////////////////////////////////////////////////
// Watch Tasks
///////////////////////////////////////////////////
gulp.task('watch', function () {
  gulp.watch('app/**/*.jade', ['markdown']);
  gulp.watch('app/scss/**/*.scss', ['styles']);
  gulp.watch('app/js/**/*.js', ['scripts']);
});

gulp.task('default', ['markdown', 'styles' , 'scripts', 'bower_scripts', 'bower_styles', 'browser-sync', 'watch']);