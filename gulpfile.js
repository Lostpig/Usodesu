'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');
var del = require('del');

var SRC = 'dev/**/*.es';
var DEST = 'dist';

var ADDONS = 'addons_dev',
	ADDONSDIST = 'addons';

gulp.task('compile', function () {
	var a = gulp.src(SRC)
		.pipe(babel())
		.pipe(gulp.dest(DEST));
	var b = gulp.src(ADDONS + '/*/**.es')
		.pipe(babel())
		.pipe(gulp.dest(ADDONSDIST));
	var c = gulp.src(ADDONS + '/*/**.!(es)')
		.pipe(gulp.dest(ADDONSDIST));
});

gulp.task('clean', function (done) {
	del(DEST + '/*', done);
});

gulp.task('dev', ['default'], function () {
	gulp.watch(SRC, ['compile']);
});

gulp.task('default', ['clean', 'transpile']);
