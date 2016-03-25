import fs from 'fs';
import glob from 'glob';
import yaml from 'yamljs';
import path from 'path';
import moment from 'moment';
import paths from '../paths';
import gutil from 'gulp-util';
import config from './config';

export default function () {

	return glob.sync(paths.content.posts).map(function(file) {
		// Read post markdown file
		const post = fs.readFileSync(file.toString(), 'utf8');
		// Split away meta header
		const parts = /<!--([\s\S]*)-->([\s\S]*)/.exec(post);

		if (!parts || !parts[1] || !parts[2]) {
			throw new Error("The markdown file is missing either content or the header.");
		}

		const meta = yaml.parse(parts[1]);

		if (!meta || !meta.created || !meta.title) {
			throw new Error("Required meta fields are missing.");
		}

		const date = moment(meta.created);
		const id = path.basename(file, '.md');
		const url = path.join(date.format("YYYY/MM/DD"), id);
		const canonical = `${config().blog.url}/${url}/`;

		return {
			canonical: canonical,
			url: url,
			id: id,
			created: date,
			meta: meta,
			markup: parts[2].trim()
		};

	}).filter(post => {
		// Filter out draft articles if --production was specified when running gulp
		return post.meta.status !== 'draft' || gutil.env.production === undefined;
	}).sort(function(a, b) {
		return b.created - a.created;
	});
};
