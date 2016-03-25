const src = 'src';
const content = 'content';
const build = 'build';

export default {
	src,
	sources: {
		templatePath: `${src}/templates/`,
		templates: `${src}/templates/*.hbs`,
		index: `${src}/index.hbs`,
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
