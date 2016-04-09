export default function(gulp, paths, _, watch, pipelines) {

	gulp.task('images', () => {
		return gulp.src(paths.content.images)
			.pipe(pipelines.images())
			.pipe(gulp.dest(`${paths.build}/images`));
	});

	watch(paths.content.images, ['images']);

	return {
		build: 'images'
	};

}
