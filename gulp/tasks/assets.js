export default function(gulp, paths, _, watch) {
	gulp.task('assets', () => {
		return gulp.src(paths.sources.assets, { base: paths.src })
			.pipe(gulp.dest(paths.build));
	});

	watch(paths.sources.assets, ['assets']);

	return {
		build: 'assets'
	};

}
