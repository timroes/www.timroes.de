import fs from 'fs';
import path from 'path';
import sitemap from 'sitemap';
import posts from '../data/posts';
import pages from '../data/pages';
import config from '../data/config';
import {fromString} from '../utils';

export default function(gulp, paths) {

	gulp.task('sitemap', () => {
		let seriesFound = {};

		let allPosts = posts();
		allPosts.reverse();

		const sm = sitemap.createSitemap({
			hostname: config().blog.url,
			urls: [
				{ url: '/', changefreq: 'weekly', priority: 1.0 },
				...allPosts.map(post => {
					let prio = 1.0;
					if (post.meta.series) {
						// Give first post in series prio 1.0 the rest only 0.9
						// That's why we also order the posts in reverse above.
						prio = post.meta.series in seriesFound ? 0.9 : 1.0;
						seriesFound[post.meta.series] = true;
					}
					return {
						url: post.url,
						changefreq: 'monthly',
						priority: prio
					};
				}),
				...pages().map(page => {
					return {
						url: page.url,
						changegreq: 'monthly',
						priority: 0.5
					};
				})
			]
		});

		return fromString('sitemap.xml', sm.toString())
			.pipe(gulp.dest(paths.build))
	});

	return {
		build: 'sitemap'
	};

}
