/**
 * This file uses the lazypipe module to initialize pipelines for different
 * filetypes. These pipelines will be used in the different tasks, when that
 * kind of file type will be produced.
 */
import gulp from 'gulp';
import lazypipe from 'lazypipe';
import paths from './paths';
import helpers from './handlebarHelpers';

const _ = require('gulp-load-plugins')();

// The pipeline used to optimize HTML.
export const html = lazypipe()
		.pipe(_.hashSrc, {
			src_path: paths.src,
			build_dir: paths.build,
			query_name: '',
			hash_len: 6
		})
		.pipe(_.htmlmin, {
			collapseWhitespace: true,
			removeComments: true
		})
		.pipe(_.minifyInline);

export function handlebars(data) {
	return lazypipe()
		.pipe(_.compileHandlebars, data, {
			batch: paths.sources.templatePath,
			helpers: helpers
		})();
};

export const images = lazypipe()
	.pipe(_.imagemin, {
		progressive: true
	});
