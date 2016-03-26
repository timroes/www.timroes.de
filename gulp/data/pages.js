import fs from 'fs';
import glob from 'glob';
import path from 'path';
import paths from '../paths';
import config from './config';
import _ from 'lodash';

export default function () {

	return glob.sync(paths.content.pages).map(function(file) {
		const page = fs.readFileSync(file.toString(), 'utf8');

		let id = path.basename(file, '.md');
		const hidden = id.indexOf('.') === 0;
		if (hidden) {
			id = id.substring(1);
		}
		const url = id;
		const canonical = `${config().blog.url}/${url}/`;

		return {
			canonical: canonical,
			url: url,
			id: id,
			markup: page,
			title: _.lowerCase(id),
			hidden: hidden
		};

	});
};
