"use strict";

const gulp = require('gulp');
const tslint = require('gulp-tslint');
const tsc = require('gulp-typescript');

const browserify = require('browserify');
const transform = require('vinyl-transform');
const uglify = require('gulp-uglify')
const sourcemaps = require('gulp-sourcemaps')

var browserified = transform(function(filename) {
var b = browserify({ entries: filename, debug: true });
return b.bundle();
});


var source_files_pattern = "source/ts/**/**.ts"
var source_td_files_pattern = "source/interfaces/interfaces.d.ts"
var test_files_pattern = "test/ts/**/**.test.ts"

//******************************************************************************
//* WELCOME
//******************************************************************************

gulp.task('welcome', function () {
    console.log('Hello World!');
})

//******************************************************************************
//* TS COMPILATION
//******************************************************************************

/*
* полный список опций компилятора: 
* https://www.typescriptlang.org/docs/handbook/compiler-options.html
*
* пояснения к текущей компиляции:
* removeComments - удаляем все комментарии
* noImplicitAny - не ругаемся на any тип переменных
* target - спецификация javascript (ES3, ES5, ...)
* module - модульная обертка для соответсвующего стандарта,
* в данном случае commonjs что позволяет использовать итоговые js файлы
* в теге <script> 
* declaration - автоматическое создание файлов деклораций (интрерфейсов)
*/

var tsProject = tsc.createProject('tsconfig.json');
gulp.task("scripts", function() {
    return gulp.src([
            source_files_pattern,
            source_td_files_pattern
        ])
        .pipe(tsc(tsProject))
        .js.pipe(gulp.dest("source/"));
});

//******************************************************************************
//* TS TESTS COMPILATION
//******************************************************************************

var tsTestProject = tsc.createProject('tsconfig.json');
gulp.task('tsc-tests', function() {
    return gulp.src('./test/**/**.test.ts')
        .pipe(tsc(tsTestProject ))
        .js.pipe(gulp.dest('./temp/test/'));
});


//******************************************************************************
//* LINT
//******************************************************************************

gulp.task('lint', function() {
   

    return gulp.src(["./" + source_files_pattern,
                     "./" + test_files_pattern
    ])
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
})


//******************************************************************************
//* COMPLECSE BUILD
//******************************************************************************

gulp.task('build',['scripts','tsc-tests', 'lint']);


//******************************************************************************
//* DEFAULT
//******************************************************************************

gulp.task('default',['lint','scripts']);


//******************************************************************************
//* BUNDLE
//******************************************************************************

var tempProject = tsc.createProject('tsconfig.json');
gulp.task("temp-scripts", function() {
    return gulp.src([
            ".temp/source/js/**/**.ts",
            ".temp/source/js/**/**.d.ts"
        ])
        .pipe(tsc(tempProject))
        .js.pipe(gulp.dest(".temp/source/js/"));
});

gulp.task('temp-bundle', function () {
return gulp.src('.temp/source/js/main.js')
.pipe(browserified)
.pipe(sourcemaps.init({ loadMaps: true }))
.pipe(uglify())
.pipe(sourcemaps.write('./'))
.pipe(gulp.dest('./dist/source/js/'));
});

gulp.task('temp',['temp-scripts','temp-bundle']);

