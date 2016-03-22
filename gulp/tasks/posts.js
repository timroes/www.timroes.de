import authors from '../data/authors';
import posts from '../data/posts';
import render from '../render';
import merge from 'merge-stream';

export default function(gulp, paths, _, watch, pipelines) {

	gulp.task('posts', () => {
		const postStreams = posts().map(post => {
			const data = {
				post: post,
				authors: authors(),
				type_post: true
			};

			// Render markup to HTML and add to data
			data.post.content = render(post.markup);

			return gulp.src(paths.sources.index)
				.pipe(_.compileHandlebars(data, {
					batch: paths.sources.templatePath
				}))
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
