export default function(gulp, paths, _, watch) {

	gulp.task('images', () => {
		return gulp.src(paths.content.images)
			.pipe(_.imagemin())
			.pipe(gulp.dest(`${paths.build}/images`));
	});

	watch(paths.content.images, ['images']);

	return {
		build: 'images'
	};

}
