"use strict";

const gulp = require('gulp');
const tslint = require('gulp-tslint');
const tsc = require('gulp-typescript');

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
//* DEFAULT
//******************************************************************************

gulp.task('default',['lint']);