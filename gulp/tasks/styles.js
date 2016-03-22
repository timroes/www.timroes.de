export default function(gulp, paths, _, watch) {

	gulp.task('styles', () => {
		return gulp.src(paths.sources.styles)
			.pipe(_.sass().on('error', _.sass.logError))
			.pipe(_.cleanCss())
			.pipe(_.rename({
				extname: '.min.css'
			}))
			.pipe(gulp.dest(paths.build))
			.pipe(_.connect.reload());
	});

	watch(`${paths.sources.styles}`, ['styles']);

	return {
		build: 'styles'
	};

}
