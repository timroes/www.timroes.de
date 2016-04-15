import config from '../data/config';
import mergeStream from 'merge-stream';

export const sizes = [
	192, 168, 144, 96, 72, 48
];

export default function(gulp, paths, _, watch) {

	gulp.task('favicons', () => {
		const conf = config();
		const streams = sizes.map(size => {
			return gulp.src(`${paths.content.base}/${conf.blog.favicon}`)
				.pipe(_.imageResize({
					width: size,
					imageMagick: true
				}))
				.pipe(_.rename({
					suffix: size
				}));
		});

		return mergeStream(...streams)
			.pipe(gulp.dest(paths.build));
	});

	return {
		resources: 'favicons'
	};

}
