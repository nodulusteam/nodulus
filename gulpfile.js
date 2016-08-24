
var gulp = require('gulp-group')(require('gulp'));
var minify = require('gulp-minify');
bump = require('gulp-bump'),
    debug = require('gulp-debug'),
    path = require('path'),
    uglify = require('gulp-uglify'),
    copy = require('gulp-copy'),
    rimraf = require('gulp-rimraf'),
    ignore = require('gulp-ignore'),
    runSequence = require('run-sequence'),
    del = require('del'),
    fs = require('fs'),
    concat = require('gulp-concat'),
    order = require('gulp-order'),
    rename = require("gulp-rename"),
    inject = require('gulp-inject'),
    replace = require('gulp-replace'),
    typescript = require('gulp-typescript'),
    tslint = require('gulp-tslint'),
    sourcemaps = require('gulp-sourcemaps'),
    Config = require('./gulpfile.config'),
    bundle = require('gulp-bundle-assets'),
    cssmin = require('gulp-cssmin'),
    mainBowerFiles = require('main-bower-files');



var tsProject = typescript.createProject('server/tsconfig.json');
var destination = "../basic/-nodulus-shell";
var config = new Config();

gulp.group('dev', function () {


    gulp.group('inject', function () {


        gulp.task('index', function () {

            gulp.src('./client/default.html')
                .pipe(inject(gulp.src(mainBowerFiles({ filter: '**/*.js' }), { read: false }), { starttag: '<!-- inject:head:{{ext}} -->' }))
                .pipe(inject(gulp.src(['./client/css/*.css'], { read: false }), { starttag: '<!-- inject:style:css -->' }))
                .pipe(inject(gulp.src(['./client/app/**/*.js'], { read: false }), { starttag: '<!-- inject:client:js -->' }))
                .pipe(gulp.dest('./client'));

            // .pipe(inject(gulp.src(['./client/app/**/*.js', './client/css/*.css'], { read: false })))
            // .pipe(debug())
            // .pipe(inject(gulp.src(mainBowerFiles({ filter: '**/*.js' }, { read: false }), { starttag: '<!-- inject:head:js -->' })))
            // .pipe(debug())
            // .pipe(gulp.dest('./client'));
        });
    });
});


gulp.group('production', function () {
    gulp.task('bump', function () {
        gulp.src('./package-shell.json')
            .pipe(bump())           
            .pipe(rename('package.json'))
            .pipe(gulp.dest(destination));
    });

    gulp.task('uglifynode', function () {
        return gulp.src(['./release/routes/*.js', './release/classes/**/*.js'])
            .pipe(uglify())
            .pipe(gulp.dest(function (file) {
                return path.join('./', path.dirname(file.path));
            }));
    });


    gulp.group('bundle', function () {
        gulp.task('vendor-scripts', function () {
            return gulp.src(mainBowerFiles({ filter: '**/*.js' }))
                .pipe(concat('vendor.js'))
                .pipe(minify())
                .pipe(gulp.dest('./client/scripts/'));
        });
        gulp.task('vendor-css', function () {
            return gulp.src(mainBowerFiles({ filter: ['**/*.css', '**/*.less'] }))
                .pipe(concat('vendor.css'))
                .pipe(cssmin())
                .pipe(rename({ suffix: '-min' }))
                .pipe(gulp.dest('./client/css/'));
        });
        gulp.task('app-scripts', function () {
            return gulp.src(['client/app/**/*.js'])
                .pipe(order(['app/**/_*.js', 'app/**/*.js']))
                .pipe(concat('client.js'))
                .pipe(minify())
                .pipe(gulp.dest('./client/scripts/'));
        });
        gulp.group('inject', function () {
            gulp.task('inject-all', function () {
                gulp.src('./client/default.html')
                    .pipe(inject(gulp.src('./client/scripts/vendor-min.js', { read: false }), { ignorePath: '/client', starttag: '<!-- inject:head:{{ext}} -->' }))
                    .pipe(inject(gulp.src(['./client/css/*.css'], { read: false }), { ignorePath: '/client',starttag: '<!-- inject:style:css -->' }))
                    .pipe(inject(gulp.src(['./client/scripts/client-min.js'], { read: false }), { ignorePath: '/client',starttag: '<!-- inject:client:js -->' }))
                    .pipe(gulp.dest('./client'));
            });

            gulp.group('copy-files-dest', function () {
                gulp.task('create_client', function () {
                    gulp.src(['client/css/**/*.*',
                        'client/font/**/*.*',
                        'client/setup/**/*.*',
                        'client/fonts/**/*.*',
                        'client/partials/**/*.*',
                        'client/styles/**/*.*',
                        'client/themes/**/*.*',
                        'client/scripts/vendor/**/*.*',
                        'client/scripts/vendor-min.js',
                        'client/scripts/client-min.js',
                        'client/*.*',
                        '!client/app/**/',
                        '!client/config/**/'

                    ])
                        .pipe(copy(destination + "/client", { prefix: 1 }));
                });

                gulp.task('create_server', function () {
                    gulp.src(['server/**/*.*', '!server/**/*.ts'])
                        .pipe(copy(destination + "/server", { prefix: 1 }));
                });

                // gulp.task('copyPackageJson', function () {
                //     gulp.src('./package-shell.json')
                //         .pipe(rename('package.json'))
                //         .pipe(gulp.dest(destination));
                // });


                gulp.task('copyReadme', function () {
                    gulp.src('./README-release.md')
                        .pipe(rename('README.md'))
                        .pipe(gulp.dest(destination));
                });


                gulp.task('copy_main_appjs', function () {
                    gulp.src(['app.js', 'master.js'])
                        .pipe(copy(destination, { prefix: 1 }));
                });

            });

        });
    });
});

gulp.task('clean_release', function () {
    return del("release");
});


gulp.task('clean_server_release', function () {
    del("release/server/node_modules");
    //del("release/server/**/*.ts");
    return del("release/server/nodulus_modules");

    // return gulp.src(['release/server/**/*.ts' , 'release/server/**/*.njsproj', 'release/server/**/*.sln'], { read: false })// much faster 
    ////.pipe(ignore('node_modules/**'))
    //.pipe(rimraf());
});

gulp.group('compile', function () {
    gulp.task('clean-ts', function (cb) {
        var typeScriptGenFiles = [
            config.tsOutputPath + '/**/*.js',    // path to all JS files auto gen'd by editor
            config.tsOutputPath + '/**/*.js.map', // path to all sourcemap files auto gen'd by editor
            '!' + config.tsOutputPath + '/lib'
        ];

        // delete the files
        del(typeScriptGenFiles, cb);
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
            .pipe(typescript(tsProject));

        tsResult.dts.pipe(gulp.dest(config.tsOutputPath));
        return tsResult.js
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(config.tsOutputPath));
    });

    /**
     * Remove all generated JavaScript files from TypeScript compilation.
     */


});



// gulp.task('copyConfig', function () {
//     // copy any html files in source/ to public/
//     gulp.src('./package-shell.json').pipe(gulp.dest('../basic/-nodulus-shell/package.json'));
// });
gulp.task('build', function () {
    runSequence('clean_release', ['ts-lint', 'compile-ts'],
        'bundle-vendor', 'bundle-vendor-css', 'bundle-client', 'copy-files-dest', 'inject-dest'
    );
});

gulp.task('build-local', function () {
    runSequence('bundle-vendor', 'bundle-vendor-css', ['bundle-client'], 'vendor-dev', 'index');
});


var install = require("gulp-install");
gulp.task('npm-install', function () {
    gulp.src([dest + '/package.json'])
        .pipe(install({ production: true, noOptional: true }));
});

gulp.task('default', ['production']);
