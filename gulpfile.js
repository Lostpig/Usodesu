'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');

var SRC = 'dev/**.es';
var DEST = 'src';

gulp.task('transpile', function () {
	return gulp.src(SRC).
		pipe(babel()).
		pipe(gulp.dest(DEST));
});

gulp.task('clean', function (done) {
	del(DEST + '/*', done);
});

gulp.task('dev', ['default'], function () {
	gulp.watch(SRC, ['transpile']);
});

gulp.task('default', ['clean', 'transpile']);
