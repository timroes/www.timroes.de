/**
 * This file uses the lazypipe module to initialize pipelines for different
 * filetypes. These pipelines will be used in the different tasks, when that
 * kind of file type will be produced.
 */
import gulp from 'gulp';
import lazypipe from 'lazypipe';

const _ = require('gulp-load-plugins')();

// The pipeline used to optimize HTML.
const html = lazypipe()
		.pipe(_.htmlmin, {
			collapseWhitespace: true,
			removeComments: true
		});

export default {
	html
};
