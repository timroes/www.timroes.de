export default function(gulp, paths, _) {

	gulp.task('serve', () => {
		_.connect.server({
			root: paths.build,
			livereload: true
		});
	});

	return {
		dev: 'serve'
	};

}
