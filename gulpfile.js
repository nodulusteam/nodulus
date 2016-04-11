var gulp = require('gulp');
var minify = require('gulp-minify');

var debug = require('gulp-debug');
var path = require('path');
var uglify = require('gulp-uglify');
var copy = require('gulp-copy');
var rimraf = require('gulp-rimraf');
var ignore = require('gulp-ignore');
var runSequence = require('run-sequence');
var del = require('del');
var fs = require('fs');

var gulp = require('gulp'),
    debug = require('gulp-debug'),
    inject = require('gulp-inject'),
    tsc = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    sourcemaps = require('gulp-sourcemaps'),    
    Config = require('./gulpfile.config'),
    tsProject = tsc.createProject('server/tsconfig.json');


var config = new Config();

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
    .pipe(copy("release/client", { prefix: 1 }));
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
    .pipe(copy("release/server", { prefix: 1 }));
   // .pipe(debug());
    //.pipe(debug())
    //.pipe(minify({
    //    exclude: ['tasks'],
    //    ignoreFiles: ['.combo.js', '-min.js']
    //}))
    //.pipe(gulp.dest('release/public'))
});

gulp.task('copy_main_appjs', function () {
    gulp.src('app.js')
    .pipe(copy("release/", { prefix: 1 }));
    
      
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
    
    del("release/server/node_modules/*.*");
    
    return gulp.src(['release/server/**/*.ts' , 'release/server/**/*.njsproj', 'release/server/**/*.sln'], { read: false })// much faster 
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
    var tsResult = tsProject.src().pipe(typescript(tsResult));
    return tsResult.js.pipe(gulp.dest('./'));
});


/**
 * Lint all custom TypeScript files.
 */
gulp.task('ts-lint', function () {
    return gulp.src(config.allTypeScript).pipe(tslint()).pipe(tslint.report('prose'));
});

/**
 * Compile TypeScript and include references to library and app .d.ts files.
 */
gulp.task('compile-ts', function () {
    var sourceTsFiles = [config.allTypeScript,                //path to typescript files
        config.libraryTypeScriptDefinitions]; //reference to library .d.ts files
    
    
    var tsResult = gulp.src(sourceTsFiles)
                       .pipe(sourcemaps.init())
                       .pipe(tsc(tsProject));
    
    tsResult.dts.pipe(gulp.dest(config.tsOutputPath));
    return tsResult.js
                        .pipe(sourcemaps.write('.'))
                        .pipe(gulp.dest(config.tsOutputPath));
});

/**
 * Remove all generated JavaScript files from TypeScript compilation.
 */
gulp.task('clean-ts', function (cb) {
    var typeScriptGenFiles = [
        config.tsOutputPath + '/**/*.js',    // path to all JS files auto gen'd by editor
        config.tsOutputPath + '/**/*.js.map', // path to all sourcemap files auto gen'd by editor
        '!' + config.tsOutputPath + '/lib'
    ];
    
    // delete the files
    del(typeScriptGenFiles, cb);
});



gulp.task('build', function () {
    runSequence('clean_release', ['ts-lint', 'compile-ts'] 
    ,
      
              ['create_client', 'create_server'],
              'clean_server_release','copy_main_appjs'
    );
});


gulp.task('default', ['build']);
