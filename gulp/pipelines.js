/**
 * This file uses the lazypipe module to initialize pipelines for different
 * filetypes. These pipelines will be used in the different tasks, when that
 * kind of file type will be produced.
 */
import gulp from 'gulp';
import lazypipe from 'lazypipe';
import paths from './paths';
import helpers from './handlebarHelpers';
import config from './data/config';

const _ = require('gulp-load-plugins')();

// The pipeline used to optimize HTML.
const html = lazypipe()
		.pipe(_.htmlmin, {
			collapseWhitespace: true,
			removeComments: true
		})
		.pipe(_.minifyInline);

const handlebars = function(data) {
	data.config = config();
	return lazypipe()
		.pipe(_.compileHandlebars, data, {
			batch: paths.sources.templatePath,
			helpers: helpers
		})();
};

export default {
	handlebars,
	html
};
