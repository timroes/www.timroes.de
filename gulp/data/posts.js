import glob from 'glob';
import path from 'path';
import moment from 'moment';
import paths from '../paths';
import gutil from 'gulp-util';
import config from './config';
import * as utils from '../utils';

export default function () {

	const posts = glob.sync(paths.content.posts).map(function(file) {

		const {meta, markdown} = utils.readFrontmatterFile(file.toString());

		if (!meta || !meta.created || !meta.title) {
			throw new Error("Required meta fields are missing.");
		}

		const date = moment(meta.created);
		const id = path.basename(file, '.md');
		const url = `/${path.join(date.format("YYYY/MM/DD"), meta.slug || id)}`;

		return {
			url: url,
			id: id,
			created: date,
			meta: meta,
			markdown: markdown.trim()
		};

	}).filter(post => {
		// Filter out draft articles if --production was specified when running gulp
		return post.meta.status !== 'draft' || gutil.env.production === undefined;
	}).sort(function(a, b) {
		return b.created - a.created;
	});

	const series = {};
	// Find series posts matching together
	posts.forEach(function(post) {
		if (post.meta.series) {
			series[post.meta.series] = series[post.meta.series] || [];
			series[post.meta.series].push(post);
			post.series = series[post.meta.series];
		}
	});

	return posts;
};
