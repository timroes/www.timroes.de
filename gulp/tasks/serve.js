import gzip from 'connect-gzip';

export default function(gulp, paths, _) {

	gulp.task('serve', () => {
		const middlewares = [];
		if (_.util.env.gzip !== undefined) {
			middlewares.push(gzip.gzip());
		}
		_.connect.server({
			root: paths.build,
			livereload: true,
			middleware: () => middlewares
		});
	});

	return {
		dev: 'serve'
	};

}
