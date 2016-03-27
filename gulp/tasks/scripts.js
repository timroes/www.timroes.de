import posts from '../data/posts';
import render from '../render';
import merge from 'merge-stream';

export default function(gulp, paths, _, watch, pipelines) {

	gulp.task('scripts', () => {
		return gulp.src(paths.sources.scripts)
			.pipe(_.webpack({
				module: {
					loaders: [
						{ test: /\.js$/, loader: 'babel' }
					]
				}
			}))
			.pipe(_.uglify())
			.pipe(_.rename('app.min.js'))
			.pipe(gulp.dest(paths.build));
	});

	watch(paths.sources.scripts, ['scripts']);

	return {
		build: 'scripts'
	};
}
