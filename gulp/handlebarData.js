import Renderer from './rendering/Renderer';
import posts from './data/posts';
import config from './data/config';
import authors from './data/authors';
import pages from './data/pages';

const renderer = new Renderer();

function baseData() {
	const data = {
		config: config(),
		authors: authors(),
		pages: pages()
	};

	data.blogAuthor = data.authors[data.config.blog.author];
	data.blogAuthor.id = data.config.blog.author;

	return data;
}

export function postData (post) {
	return {
		...baseData(),
		type_post: true,
		post: post,
		canonical: `${config().blog.url}${post.url}`,
		description: post.meta.summary,
		title: post.meta.title
	};
}

export function pageData (page) {
	return {
		...baseData(),
		type_page: true,
		page: page,
		content: renderer.render(page.markdown).html,
		canonical: `${config().blog.url}${page.url}`,
		description: config().blog.headline,
		title: page.meta.title
	};
}

export function indexData () {
	return {
		...baseData(),
		type_index: true,
		posts: posts(),
		canonical: config().blog.url,
		description: config().blog.headline,
		title: config().blog.title
	}
}
