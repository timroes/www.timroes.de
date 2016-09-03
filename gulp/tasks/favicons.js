import config from '../data/config';
import mergeStream from 'merge-stream';

export const sizes = [
	192, 180, 168, 144, 128, 120, 96, 72, 60, 48
];

export default function(gulp, paths, _, watch, pipelines) {

	gulp.task('favicons', () => {
		const conf = config();
		const streams = sizes.map(size => {
			return gulp.src(`${paths.content.base}/${conf.blog.favicon}`)
				.pipe(_.imageResize({
					width: size,
					imageMagick: true,
					filter: 'Point'
				}))
				.pipe(pipelines.images())
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
