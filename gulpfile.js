var gulp = require('gulp');
var minify = require('gulp-minify');
var typescript = require('gulp-typescript');
var debug = require('gulp-debug');
var path = require('path');
var uglify = require('gulp-uglify');
var copy = require('gulp-copy');

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


gulp.task('default', ['compile', 'create_client', 'create_server']);
