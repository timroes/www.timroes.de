import fs from 'fs';
import RSS from 'rss';
import config from '../data/config';
import posts from '../data/posts';
import {postData} from '../handlebarData';

export default function(gulp, paths, _, watch) {

	gulp.task('feed', (cb) => {
		const conf = config();
		const feed = new RSS({
			title: conf.blog.title,
			description: conf.blog.headline,
			site_url: conf.blog.url,
			feed_url: 'TODO',
			language: conf.blog.language,
			categories: [conf.blog.category],
			generator: 'Static Blog Generation by Tim Roes',
			custom_namespaces: {
				sy: 'http://purl.org/rss/1.0/modules/syndication/'
			},
			custom_elements: [
				{
					'sy:updatePeriod': 'daily',
				},
				{
					'sy:updateFrequency': 1
				}
			]
		});

		posts().forEach(post => {
			const data = postData(post);
			feed.item({
				title: data.title,
				description: data.description,
				url: data.canonical,
				categories: [post.meta.category],
				date: post.created,
				comments: `${data.canonical}#comments`
			});
		});

		fs.writeFile(`${paths.build}/feed.xml`, feed.xml(), cb);
	});

	watch([
		paths.content.posts,
		paths.content.authors
	], ['feed']);

	return {
		build: 'feed'
	};
}
