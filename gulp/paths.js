const src = 'src';
const content = 'content';
const build = 'build';

export default {
	src,
	sources: {
		assets: `${src}/assets/**`,
		templatePath: `${src}/templates/`,
		templates: `${src}/templates/*.hbs`,
		index: `${src}/index.hbs`,
		scripts: `${src}/scripts/**/*.js`,
		styles: `${src}/styles/[^_]*.less`,
		stylesAll: `${src}/styles/**/*.less`
	},
	build,
	content: {
		config: `${content}/config/*.yml`,
		authors: `${content}/authors/*.yml`,
		images: `${content}/images/**/*.+(jpg|png|gif)`,
		pages: `${content}/pages/*.md`,
		posts: `${content}/posts/**/*.md`
	}
};
