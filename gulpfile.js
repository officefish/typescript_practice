/*jshint esversion: 6 */
(function () {
   'use strict';
   // this function is strict...
}());

const config = require('./gulp.config')();

const gulp = require('gulp');
const del = require('del');
const $ = require('gulp-load-plugins')({ lazy: true });
const tslintStylish = require('tslint-stylish');
const args = require('yargs').argv;
const exec = require('child_process').exec;
const tsc = require('gulp-typescript');
const browserSync = require('browser-sync');



/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing.withFilters(/:/));
gulp.task('default', ['help']);

/**
 * Lint
 */

/**
 * vet typescript code
 * @return {Stream}
 */
gulp.task('vet:typescript', function () {

    log('Analyzing typescript code with TSLint');

    return gulp
        .src(config.ts.files)
        .pipe($.tslint())
        .pipe($.tslint.report(tslintStylish, {
            emitError: false,
            sort: true,
            bell: false
        }));
});

/**
 * vet es5 code
 * --verbose
 * @return {Stream}
 */
gulp.task('vet:es5', function(){

    log('Analyzing ES5 code with JSHint');

    return gulp
        .src(config.js.root)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {verbose: true}))
        .pipe($.jshint.reporter('fail'));
});

/**
 * Vet both ES5 and TypeScript
 * @return {Stream}
 */
gulp.task('scripts-vet', ['vet:es5', 'vet:typescript'], function () {
});

/**
 * Remove generated files
 * @return {Stream}
 */
gulp.task('clean:generated', function () {

    log('Cleaning generated files: ' + $.util.colors.blue(config.ts.out));
    return del(config.ts.out);
});


/**
 * Compile TypeScript
 */
gulp.task('typescript-compile', ['vet:typescript', 'clean:generated'], function () {

    log('Compiling TypeScript');
    //exec('node_modules/typescript/bin/tsc -p src');
    var tsProject = tsc.createProject("src/tsconfig.json");
   
    return gulp.src(
            config.ts.files
         )
        .pipe(tsc(tsProject))
        .pipe($.sourcemaps.init())
        .pipe($.sourcemaps.write(".map"))
        .pipe(gulp.dest(config.ts.out));
});

/**
 * Watch and compile TypeScript
 */
gulp.task('typescript-watch', ['typescript-compile'], function () {
     return gulp.watch(config.ts.files, ['typescript-compile']);
});

gulp.task('typescript-test-watch', ['typescript-compile'], function () {
     return gulp.watch(config.ts.files, ['typescript-compile'])
        .on('change', browserSync.reload);
});

/**
 * Test while watching TypeScript
 */
gulp.task('typescript-test', ['typescript-test-watch'], function () {
     var options = {
        port: 3000,
        server: './',
        files: ['./dist/**/*.js',
                './dist/**/*.spec.js',
                '!./dist/**/*.js.map'],
        logFileChanges: true,
        logLevel: 'info',
        logPrefix: 'spec-runner',
        notify: true,
        reloadDelay:1000,
        startPath: 'SpecRunner.html'
    };
    browserSync.init(options);
});




/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {

    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                 console.log(msg[item]);
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        console.log(msg);
        $.util.log($.util.colors.blue(msg));
    }
}
