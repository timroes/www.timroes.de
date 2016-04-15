import fs from 'fs';
import fm from 'front-matter';
import stream from 'stream';
import gutil from 'gulp-util';

export function readFrontmatterFile(filename) {
	const content = fs.readFileSync(filename, 'utf8');

	if (!fm.test(content)) {
		throw new Error(`The file ${filename} does not contain a valid front-matter header.`);
	}

	const {attributes: meta, body: markdown} = fm(content);
	return {meta, markdown};
}

export function fromString(filename, content) {
	const src = stream.Readable({ objectMode: true });
	src._read = function() {
		this.push(new gutil.File({
			cwd: '',
			base: '',
			path: filename,
			contents: new Buffer(content)
		}));
		this.push(null);
	};
	return src;
}
