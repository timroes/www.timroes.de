export default function(gulp, paths, _, watch) {

	gulp.task('fontello', () => {
		return gulp.src('./fontello.json')
			.pipe(_.fontello())
			.pipe(gulp.dest(`${paths.build}/icons`));
	});

	watch('./fontello.json', ['fontello']);

	return {
		build: 'fontello'
	};

}
