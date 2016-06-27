"use strict";

const gulp = require('gulp');
const tslint = require('gulp-tslint')

//******************************************************************************
//* WELCOME
//******************************************************************************

gulp.task('welcome', function () {
    console.log('Hello World!');
})

//******************************************************************************
//* LINT
//******************************************************************************

gulp.task('lint', function(){
    var source_files_pattern = "./source/ts/**/**.ts"
    var test_files_pattern = "./test/ts/**/**.test.ts"

    return gulp.src([, source_files_pattern,
                     test_files_pattern
    ])
    .pipe(tslint())
    .pipe(tslint.report('verbose'));
})