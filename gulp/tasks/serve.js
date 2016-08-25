import gzip from 'connect-gzip';

export default function(gulp, paths, _) {

	gulp.task('serve', () => {
		_.connect.server({
			root: paths.build,
			livereload: true,
			middleware: () => [ gzip.gzip() ]
		});
	});

	return {
		dev: 'serve'
	};

}
