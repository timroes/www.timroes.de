import {postData} from '../handlebarData';
import posts from '../data/posts';
import merge from 'merge-stream';
import runSequence from 'run-sequence';

export default function(gulp, paths, _, watch, pipelines) {

	const mtimes = {};

	/**
	 * If buildAll is true all posts will be build. Otherwise only posts where
	 * the actual markdown file has changed will be build.
	 */
	function buildPosts(buildAll) {
		const postStreams = posts().filter(post => {
			// Filter out posts that haven't been modified since last run of this task
			return buildAll || !mtimes[post.id] || !post.mtime.isSame(mtimes[post.id]);
		}).map(post => {
			mtimes[post.id] = post.mtime;
			_.util.log(`Building output for post '${_.util.colors.cyan(post.id)}'...`);
			return gulp.src(paths.sources.index)
				.pipe(pipelines.handlebars(postData(post)))
				.pipe(_.rename(post.url + '/index.html'))
				.pipe(pipelines.html());
		});

		if (postStreams.length > 0) {
			return merge(...postStreams)
				.pipe(gulp.dest(paths.build))
				.pipe(_.connect.reload());
		}
	}

	gulp.task('posts', ['resources'], (done) => {
		runSequence('posts-no-deps', done);
	});

	// Task that will rebuild all posts (without any dependet tasks, like resources).
	gulp.task('posts-no-deps', buildPosts.bind(null, true));

	// Task that will rebuild only the posts where the content files has changed.
	gulp.task('posts-content-changed', buildPosts.bind(null, false))

	watch([
		paths.sources.index,
		paths.sources.templates,
	], ['posts-no-deps']);

	watch([
		paths.content.posts,
		paths.content.authors
	], ['posts-content-changed']);

	return {
		build: 'posts'
	};

}
