/*jshint esversion: 6 */
(function () {
   'use strict';
   // this function is strict...
}());

const config = require('./gulp.config')();

const gulp = require('gulp');
const $ = require('gulp-load-plugins')({ lazy: true });
const tslintStylish = require('tslint-stylish');
const args = require('yargs').argv;




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
