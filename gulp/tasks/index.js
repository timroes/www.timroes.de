import posts from '../data/posts';

export default function(gulp, paths, _, watch, pipelines) {

	gulp.task('index', () => {
		const data = {
			posts: posts(),
			type_index: true
		};

		return gulp.src(paths.sources.index)
			.pipe(_.compileHandlebars(data))
			.pipe(pipelines.html())
			.pipe(_.rename({
				extname: '.html'
			}))
			.pipe(gulp.dest(paths.build))
			.pipe(_.connect.reload());
	});

	watch([
		paths.content.posts,
		paths.sources.index,
		paths.sources.templates
	], ['index']);

	return {
		build: 'index'
	};
}
