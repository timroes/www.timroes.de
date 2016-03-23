import authors from '../data/authors';
import gravatar from 'gravatar';

export default function(gulp, paths, _) {

	gulp.task('gravatar', () => {
		const auths = authors();
		Object.keys(auths).forEach((id) => {
			const gravatarUrl = gravatar.url(auths[id].gravatar, { d: 'mm' }, true);
			_.download(gravatarUrl)
				.pipe(_.rename(`${id}.jpg`))
				.pipe(gulp.dest(`${paths.build}/avatars/`));
		});
	});

	return {
		build: 'gravatar'
	};

}
