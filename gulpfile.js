var gulp = require('gulp');
var minify = require('gulp-minify');
var bump = require('gulp-bump');
var debug = require('gulp-debug');
var path = require('path');
var uglify = require('gulp-uglify');
var copy = require('gulp-copy');
var rimraf = require('gulp-rimraf');
var ignore = require('gulp-ignore');
var runSequence = require('run-sequence');
var del = require('del');
var fs = require('fs');
var concat = require('gulp-concat');
var order = require('gulp-order');
var rename = require("gulp-rename");

var gulp = require('gulp'),
    debug = require('gulp-debug'),
    inject = require('gulp-inject'),
    tsc = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    sourcemaps = require('gulp-sourcemaps'),
    Config = require('./gulpfile.config'),
    tsProject = tsc.createProject('server/tsconfig.json'),
    bundle = require('gulp-bundle-assets');
var mainBowerFiles = require('main-bower-files');


var config = new Config();

gulp.task('bump', function () {
    gulp.src('./package.json')
        .pipe(bump())
        .pipe(gulp.dest('./'));
});

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
    gulp.src(['client/**/*.*', '!client/app/**/','!client/config/**/'
    
    ])
        .pipe(copy("../basic/-nodulus-shell/client", { prefix: 1 }));
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
    gulp.src(['server/**/*.*', '!server/**/*.ts'])
        .pipe(copy("../basic/-nodulus-shell/server", { prefix: 1 }));
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
        .pipe(copy("../basic/-nodulus-shell/", { prefix: 1 }));


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
    del("release/server/node_modules");
    //del("release/server/**/*.ts");
    return del("release/server/nodulus_modules");

    // return gulp.src(['release/server/**/*.ts' , 'release/server/**/*.njsproj', 'release/server/**/*.sln'], { read: false })// much faster 
    ////.pipe(ignore('node_modules/**'))
    //.pipe(rimraf());
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

gulp.task('copyPackageJson', function () {
    // copy any html files in source/ to public/
    gulp.src('./package-shell.json')
    .pipe(rename('package.json'))
    .pipe(gulp.dest('../basic/-nodulus-shell/'));
});



gulp.task('bundle-vendor', function () {



    return gulp.src(mainBowerFiles({ filter: '**/*.js' }))
        .pipe(concat('vendor.js'))
        .pipe(minify())
        .pipe(gulp.dest('./client/scripts/'));

});

gulp.task('bundle-client', function () {



    return gulp.src(['client/app/**/*.js'])
        .pipe(order(['app/**/_*.js', 'app/**/*.js']))
        .pipe(concat('client.js'))
        .pipe(minify())
        .pipe(gulp.dest('./client/scripts/'));

});

// gulp.task('copyConfig', function () {
//     // copy any html files in source/ to public/
//     gulp.src('./package-shell.json').pipe(gulp.dest('../basic/-nodulus-shell/package.json'));
// });
gulp.task('build', function () {
    runSequence('clean_release', ['ts-lint', 'compile-ts'],
       'bundle-vendor', 'bundle-client',  ['create_client', 'create_server', 'copyPackageJson'],
        'clean_server_release', 'copy_main_appjs'
    );
});


gulp.task('build-local', function () {
    runSequence('bundle-vendor', ['bundle-client']);


});


var install = require("gulp-install");
gulp.task('npm-install', function () {
    gulp.src(['../basic/-nodulus-shell/package.json'])
        .pipe(install({ production: true, noOptional: true }));
});

gulp.task('default', ['bump', 'build']);
