export default function(gulp, paths, _, watch) {

	gulp.task('files', () => {
		return gulp.src(paths.content.files, { base: paths.content.base })
			.pipe(gulp.dest(`${paths.build}`));
	});

	watch(paths.content.files, ['files']);

	return {
		resources: 'files'
	};
}
