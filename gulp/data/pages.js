import glob from 'glob';
import path from 'path';
import paths from '../paths';
import * as utils from '../utils';

export default function () {

	return glob.sync(paths.content.pages).map(function(file) {

		const {meta, markdown} = utils.readFrontmatterFile(file.toString());

		const id = path.basename(file, '.md');
		const url = `/${id}`;

		return {
			url: url,
			id: id,
			markdown: markdown,
			hidden: meta.hidden,
			meta: meta
		};

	});
};
