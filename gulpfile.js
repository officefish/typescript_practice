/*jshint esversion: 6 */
(function() {
    'use strict';
    // this function is strict...
}());


//******************************************************************************
//* DEPENDENCIES
//******************************************************************************

const config = require('./gulp.config')();

const gulp = require('gulp');
const del = require('del');
const $ = require('gulp-load-plugins')({
    lazy: true
});
const tslintStylish = require('tslint-stylish');
const args = require('yargs').argv;
const exec = require('child_process').exec;
const tsc = require('gulp-typescript');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require("vinyl-source-stream");

const bower_components = require('bower-files')();
const bower_components_js_pattern = bower_components.ext('js').files


/**
 * List the available gulp tasks
 */
gulp.task('help', $.taskListing.withFilters(/:/));


//******************************************************************************
//* LINT
//******************************************************************************

/**
 * vet typescript code
 * @return {Stream}
 */
gulp.task('vet:ts:tslint', function() {

    log('Analyzing typescript code with TSLint');
    log('source: ' + config.ts.allFiles);

    return gulp
        .src(config.ts.allFiles)
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
gulp.task('vet:js:jshint', function() {

    log('Analyzing ES5 code with JSHint');
    log('source:' + config.js.srcAndTestFiles);

    return gulp
        .src(config.js.srcAndTestFiles)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe($.jshint.reporter('fail'));
});

gulp.task('vet:scripts', ['vet:js:jshint', 'vet:ts:tslint'], function() {});


//******************************************************************************
//* CLEAN
//******************************************************************************

/**
 * Remove generated files
 * @return {Stream}
 */
gulp.task('clean:ts:generated', function() {

    log('Cleaning generated files');
    log('target: ' + $.util.colors.blue(config.js.root));

    return del(config.js.root); // config.js.dev
});

gulp.task('clean:temp', function() {

    log('Cleaning temp files');
    log('target: ' + $.util.colors.blue(config.temp));

    return del(config.temp);
});


//******************************************************************************
//* BUILD
//******************************************************************************

gulp.task('build:application', function() {
    log('Build typescript files');
    log('source: ' + $.util.colors.blue(config.ts.srcFilesAndTypings));
    log('Output folder:' + $.util.colors.blue(config.ts.out));

    var application = tsc.createProject("tsconfig.json");
    //var application = tsc.createProject("tsJasmineConfig.json");
    return gulp.src(config.ts.srcFilesAndTypings)
        .pipe(tsc(application))
        .js.pipe(gulp.dest(config.ts.out));
});

gulp.task('build:tests', function() {
    log('Build typescript test files');
    log('source: ' + $.util.colors.blue(config.ts.tests));
    log('Output folder:' + $.util.colors.blue(config.ts.testOut));

    var tests = tsc.createProject("tsconfig.json");
    //var tests = tsc.createProject("tsJasmineConfig.json");
    return gulp.src(config.ts.tests)
        .pipe(tsc(tests))
        .js.pipe(gulp.dest(config.ts.testOut));
});

gulp.task("build", function(cb) {
    runSequence(["build:application", "build:tests"], cb);
});


//******************************************************************************
//* TEST
//******************************************************************************

gulp.task('coverage:report:istanbul', function() {

    log('Code Coverage Report. Istanbul');
    log('source: ' + config.js.allTests);

    return gulp.src(config.js.allTests)
        .pipe($.istanbul())
        .pipe($.istanbul.writeReports());
})

gulp.task('test:jasmine', function() {
    log('Test typescript code with Jasmine');
    log('source: ' + config.js.jasmineTests);

    return gulp.src(config.js.jasmineTests)
        .pipe($.jasmine());
});

gulp.task("test:mocha", function() {

    log('Test typescript code with Mocha');
    log('source: ' + config.js.tests);

    return gulp.src(config.js.tests)
        .pipe($.mocha({
            ui: 'bdd'
        }))
});

gulp.task('test', function(callback) {
    runSequence(
        'coverage:report:istanbul',
        'test:jasmine',
        'test:mocha',
        callback
    );
});



//******************************************************************************
//* BUNDLE
//******************************************************************************

gulp.task("bundle", function() {

    var bundler = browserify({
        debug: true,
        standalone: config.library //libraryName
    });

    return bundler.add(config.js.main)

    .bundle()
        .pipe(source(config.js.outputFile))
        .pipe(buffer())
        .pipe($.sourcemaps.init({
            loadMaps: true
        }))
        .pipe($.uglify())
        .pipe($.sourcemaps.write('./'))
        .pipe(gulp.dest(config.js.root));
});

//******************************************************************************
//* DEV SERVER
//******************************************************************************
gulp.task("watch", ["default"], function() {

    browserSync.init({
        server: "."
    });

    gulp.watch(config.ts.files, ["default"]);
    gulp.watch(config.js.output).on('change', browserSync.reload);
});



gulp.task("sprint:watch", ["sprint"], function() {

    browserSync.init({
        server: "."
    });

    gulp.watch(config.ts.files, ["sprint"]);
    gulp.watch(config.js.output).on('change', browserSync.reload);
});

gulp.task("server", function() {

    browserSync.init({
        server: "."
    });
});

//******************************************************************************
//* DEFAULT
//******************************************************************************

gulp.task('sprint', function(callback) {
    runSequence(
        'clean:ts:generated',
        'build:application',
        'bundle',
        'server',
        callback
    );
});

gulp.task('default', function(callback) {
    runSequence(
        'clean:ts:generated',
        'vet:ts:tslint',
        'build',
        'test',
        'bundle',
        callback
    );
});

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 */
function log(msg) {

    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}