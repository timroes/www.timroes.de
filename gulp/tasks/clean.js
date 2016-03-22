import del from 'del';

export default function(gulp, paths) {
	gulp.task('clean', () => {
		return del(paths.build);
	});
}
