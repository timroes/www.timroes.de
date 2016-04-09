import fs from 'fs';
import path from 'path';
import sitemap from 'sitemap';
import posts from '../data/posts';
import pages from '../data/pages';
import config from '../data/config';

export default function(gulp, paths) {

	gulp.task('sitemap', ['index'], (cb) => {
		let seriesFound = {};

		let allPosts = posts();
		allPosts.reverse();

		const sm = sitemap.createSitemap({
			hostname: config().blog.url,
			cacheTime: 3600000,
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

		fs.writeFile(path.join(__dirname, `../../${paths.build}/sitemap.xml`), sm.toString(), (err) => {
			if (err) throw err;
			cb();
		});
	});

	return {
		build: 'sitemap'
	};

}
