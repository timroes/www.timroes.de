/*
	This file contains parser for different link types.
	If you want to parse link with a specific schema (e.g. foobar:test/123) export
	a function with the schema name in this file (in that example the function must
	be named foobar).
*/
import posts from './data/posts';

const allPosts = posts();

/**
	This default function will be used whenever no appropriate matching function
	was found.
*/
export default function(schema, href, title, text) {
	return {
		href: `${schema}:${href}`
	};
};

export function github(href, title, text) {
	return {
		href: `https://github.com/${href}`,
		classes: ['medialink-github icon-github']
	};
};

export function post(href, title, text) {
	const postUrl = allPosts.filter(post => post.id === href)[0].url;
	return {
		href: postUrl,
		blank: false
	}
};
