import posts from '../data/posts';
import config from '../data/config';
import webpackStream from 'webpack-stream';
import webpack from 'webpack';
import named from 'vinyl-named';
import merge from 'merge-stream';

export default function(gulp, paths, _, watch, pipelines) {

	function uglifyJsOptions() {
		const opts = {
			compress: {},
			output: {
				comments: false
			}
		};
		if (_.util.env.production !== undefined) {
			opts.compress.drop_console = true;
		}
		return opts;
	}

	gulp.task('scripts', () => {
		const conf = config();
		return gulp.src(paths.sources.scripts)
			.pipe(named())
			.pipe(webpackStream({
				module: {
					loaders: [
						{ test: /\.js$/, loader: 'babel' }
					]
				},
				plugins: [
					new webpack.optimize.UglifyJsPlugin(uglifyJsOptions()),
				]
			}))
			.pipe(_.rename({ extname: '.min.js' }))
			.pipe(gulp.dest(paths.build));
	});

	watch(paths.sources.scriptsAll, ['scripts']);

	return {
		resources: 'scripts'
	};
}
