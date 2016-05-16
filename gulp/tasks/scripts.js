import posts from '../data/posts';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import merge from 'merge-stream';

export default function(gulp, paths, _, watch, pipelines) {

	gulp.task('scripts', () => {
		return gulp.src(paths.sources.scripts)
			.pipe(webpackStream({
				module: {
					loaders: [
						{ test: /\.js$/, loader: 'babel' }
					]
				},
				plugins: [
					new webpack.optimize.UglifyJsPlugin()
				]
			}))
			.pipe(_.rename('app.min.js'))
			.pipe(gulp.dest(paths.build));
	});

	watch(paths.sources.scripts, ['scripts']);

	return {
		resources: 'scripts'
	};
}
