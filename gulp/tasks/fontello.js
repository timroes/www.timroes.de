export default function(gulp, paths, _, watch) {

	gulp.task('fontello', () => {

		const css = _.filter(['**/*.css'], { restore: true });

		return gulp.src('./fontello.json')
			.pipe(_.fontello())
			.pipe(css)
			.pipe(_.cleanCss())
			.pipe(css.restore)
			.pipe(gulp.dest(`${paths.build}/icons`));
	});

	watch('./fontello.json', ['fontello']);

	return {
		build: 'fontello'
	};

}
