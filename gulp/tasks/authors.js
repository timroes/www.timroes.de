import authors from '../data/authors';
import gravatar from 'gravatar';

const sizes = [
	{ size: 80, suffix: ''},
	{ size: 150, suffix: '-large'}
];

export default function(gulp, paths, _, watch, pipelines) {

	gulp.task('gravatar', () => {
		const auths = authors();
		Object.keys(auths).forEach((id) => {
			sizes.forEach((size) => {
				const gravatarUrl = gravatar.url(auths[id].gravatar, { d: 'mm', s: size.size }, true);
				_.download(gravatarUrl)
					.pipe(_.rename(`${id}${size.suffix}.jpg`))
					.pipe(pipelines.images())
					.pipe(gulp.dest(`${paths.build}/avatars/`));
			});
		});
	});

	return {
		resources: 'gravatar'
	};

}
