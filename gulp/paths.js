const src = 'src';
const content = 'content';
const build = 'build';

export default {
	src,
	sources: {
		templatePath: `${src}/templates/`,
		templates: `${src}/templates/*.hbs`,
		index: `${src}/index.hbs`,
		styles: `${src}/styles/*.scss`
	},
	build,
	content: {
		authors: `${content}/authors/*.yml`,
		posts: `${content}/posts/**/*.md`
	}
};
