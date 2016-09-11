const src = 'src';
const content = 'content';
const build = 'build';

export default {
	src,
	sources: {
		assets: `${src}/assets/**`,
		templatePath: `${src}/templates/`,
		templates: `${src}/templates/*.hbs`,
		history: `${src}/history.hbs`,
		index: `${src}/index.hbs`,
		scripts: `${src}/*.js`,
		scriptsAll: `${src}/**/*.js`,
		styles: `${src}/styles/[^_]*.less`,
		stylesAll: `${src}/styles/**/*.less`
	},
	build,
	content: {
		base: content,
		config: `${content}/config/*.yml`,
		authors: `${content}/authors/*.yml`,
		files: `${content}/files/**`,
		images: `${content}/images/**/*.+(jpg|png|gif|svg)`,
		pages: `${content}/pages/*.md`,
		posts: `${content}/posts/**/*.md`
	}
};
