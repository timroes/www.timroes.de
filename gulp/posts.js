import fs from 'fs';
import glob from 'glob';
import yaml from 'yamljs';
import path from 'path';
import marked from 'marked';
import highlightjs from 'highlight.js';

export function getAll() {

	return glob.sync('content/posts/*.md').map(function(file) {
		// Read post markdown file
		const post = fs.readFileSync(file.toString(), 'utf8');
		// Split away meta header
		const parts = /\{\{\{([\s\S]*)\}\}\}([\s\S]*)/.exec(post);
		if (!parts || !parts[1] || !parts[2]) {
			throw new Error("The markdown file is missing either content or the header.");
		}

		const meta = yaml.parse(parts[1]);

		if (!meta || !meta.created || !meta.title) {
			throw new Error("Required meta fields are missing.");
		}

		const created = new Date(meta.created);
		const slug = path.basename(file, '.md');
		const url = path.join(
			created.getFullYear().toString(),
			(created.getMonth() + 1).toString(),
			created.getDate().toString(),
			slug,
			'index.html'
		);

		return {
			url: url,
			slug: slug,
			created: created,
			meta: meta,
			content: parts[2].trim()
		};

	}).sort(function(a, b) {
		return b.created - a.created;
	});
};

export function render(content) {
	return marked(content, {
		highlight: function(code, lang) {
			if (!lang) {
				return highlightjs.highlightAuto(code).value;
			} else {
				return highlightjs.highlight(lang, code).value;
			}
		}
	});
};