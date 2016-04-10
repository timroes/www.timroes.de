import {postData} from '../handlebarData';
import posts from '../data/posts';
import render from '../render';
import merge from 'merge-stream';

export default function(gulp, paths, _, watch, pipelines) {

	gulp.task('posts', ['resources'], () => {
		const postStreams = posts().map(post => {
			return gulp.src(paths.sources.index)
				.pipe(pipelines.handlebars(postData(post)))
				.pipe(_.rename(post.url + '/index.html'))
				.pipe(pipelines.html());
		});

		return merge(...postStreams)
			.pipe(gulp.dest(paths.build))
			.pipe(_.connect.reload());
	});

	watch([
		paths.sources.index,
		paths.sources.templates,
		paths.content.posts,
		paths.content.authors
	], ['posts']);

	return {
		build: 'posts'
	};

}
