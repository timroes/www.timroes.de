import config from '../data/config';
import {fromString} from '../utils';
import {sizes as iconSizes} from './favicons';

export default function(gulp, paths, _, watch) {
	gulp.task('appManifest', () => {
		const conf = config();
		const manifest = {
			short_name: conf.blog.title,
			name: conf.blog.title,
			start_url: '/?utm_source=web_app_manifest',
			display: 'standalone',
			icons: iconSizes.map(size => {
				return {
					src: `/favicon${size}.png`,
					type: 'image/png',
					sizes: `${size}x${size}`
				};
			})
		};
		return fromString('manifest.json', JSON.stringify(manifest))
			.pipe(gulp.dest(paths.build));
	});

	return {
		build: 'appManifest'
	};

}
