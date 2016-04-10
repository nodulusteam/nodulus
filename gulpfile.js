var gulp = require('gulp');
var minify = require('gulp-minify');
var typescript = require('gulp-typescript');
var debug = require('gulp-debug');
var path = require('path');
var uglify = require('gulp-uglify');
var copy = require('gulp-copy');
var rimraf = require('gulp-rimraf');
var ignore = require('gulp-ignore');
var runSequence = require('run-sequence');
var del = require('del');
var fs = require('fs');


gulp.task('uglifynode', ['compile'], function () {
    return gulp.src(['./release/routes/*.js', './release/classes/**/*.js'])
    .pipe(debug())
    .pipe(uglify())
    .pipe(gulp.dest(function (file) {
        return path.join('./', path.dirname(file.path));
    }))
    .pipe(debug());
});


gulp.task('create_client', function () {
    gulp.src('client/**/*.*')   
    .pipe(copy("release/client",{prefix: 1}));
    // .pipe(debug())
    //, {prefix: 2}
   // .pipe(debug());
    //.pipe(debug())
    //.pipe(minify({
    //    exclude: ['tasks'],
    //    ignoreFiles: ['.combo.js', '-min.js']
    //}))
    //.pipe(gulp.dest('release/public'))
});


gulp.task('create_server', function () {
    gulp.src('server/**/*.*')    
    .pipe(copy("release/server",{prefix: 1}));
   // .pipe(debug());
    //.pipe(debug())
    //.pipe(minify({
    //    exclude: ['tasks'],
    //    ignoreFiles: ['.combo.js', '-min.js']
    //}))
    //.pipe(gulp.dest('release/public'))
});



gulp.task('clean_release', function () {
    return del("release");
    
  
   // .pipe(debug());
    //.pipe(debug())
    //.pipe(minify({
    //    exclude: ['tasks'],
    //    ignoreFiles: ['.combo.js', '-min.js']
    //}))
    //.pipe(gulp.dest('release/public'))
});


gulp.task('clean_server_release', function () {
    return gulp.src(['release/server/**/*.ts' ,'release/server/**/*.njsproj','release/server/**/*.sln'], { read: false })// much faster 
   .pipe(ignore('node_modules/**'))
   .pipe(rimraf());
});


gulp.task('compiledev', function () {
    var tsProject = typescript.createProject('tsconfig.json');
    var tsResult = tsProject.src()
      .pipe(debug())
		.pipe(typescript(tsResult));
    return tsResult.js.pipe(gulp.dest('./'));

});

gulp.task('compile', function () {
    var tsProject = typescript.createProject('server/tsconfig.json');
    var tsResult = tsProject.src()
		.pipe(typescript(tsResult));
    return tsResult.js.pipe(gulp.dest('./'));
});


gulp.task('build', function() {
  runSequence('clean_release', 'compile',
              ['compile', 'create_client', 'create_server'],
              'clean_server_release'
              );
});


gulp.task('default', ['build']);
