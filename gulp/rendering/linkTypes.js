/*
	This file contains parser for different link types.
	If you want to parse link with a specific schema (e.g. foobar:test/123) export
	a function with the schema name in this file (in that example the function must
	be named foobar).
*/
import posts from '../data/rawPosts';
import path from 'path';
import gutil from 'gulp-util';

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
		classes: ['medialink-github'],
		icon: 'github'
	};
};

export function playstore(href, title, text) {
	return {
		href: `https://play.google.com/store/apps/details?id=${href}`,
		classes: ['medialink-playstore']
	};
};

export function post(href, title, text) {
	const post = allPosts.filter(post => post.id === href)[0];
	if (!post) {
		throw new Error(`Could not find post ${href} for link generation.`);
	}
	return {
		href: post.url,
		blank: false
	};
};

export function file(href, title, text) {
	const extension = path.extname(href).substr(1);
	return {
		href: `/files/${href}`,
		classes: ['medialink-file'],
		icon: extension
	};
};

export function biglink(href, title, text) {
	return {
		classes: ['medialink-web'],
		icon: 'web'
	};
};

export function TODO() {
	if (gutil.env.production !== undefined) {
		throw new Error("TODO links are not allowed with --production!");
	}
	return {
		href: '#',
		blank: false
	};
};
