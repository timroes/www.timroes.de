import compression from 'compression';

export default function(gulp, paths, _) {

	gulp.task('serve', () => {
		_.connect.server({
			root: paths.build,
			livereload: true,
			middleware: () => [ compression() ]
		});
	});

	return {
		dev: 'serve'
	};

}
