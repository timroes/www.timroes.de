import fs from 'fs';
import fm from 'front-matter';

export function readFrontmatterFile(filename) {
	const content = fs.readFileSync(filename, 'utf8');

	if (!fm.test(content)) {
		throw new Error(`The file ${filename} does not contain a valid front-matter header.`);
	}

	const {attributes: meta, body: markdown} = fm(content);
	return {meta, markdown};
}
