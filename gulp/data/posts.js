import fs from 'fs';
import glob from 'glob';
import yaml from 'yamljs';
import path from 'path';
import moment from 'moment';
import paths from '../paths';

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
		const slug = path.basename(file, '.md');
		const url = path.join(date.format("YYYY/MM/DD"), slug);

		return {
			url: url,
			slug: slug,
			created: date,
			meta: meta,
			markup: parts[2].trim()
		};

	}).sort(function(a, b) {
		return b.created - a.created;
	});
};
