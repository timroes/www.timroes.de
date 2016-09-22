import {fromString} from '../utils';
import swprecache from 'sw-precache';

export default function(gulp, paths, _) {
	gulp.task('serviceworker', ['resources', 'posts', 'pages', 'index'], (done) => {
		const handleFetch = _.util.env.production !== undefined || _.util.env['with-sw'] !== undefined;
		if (!handleFetch) {
			_.util.log(_.util.colors.yellow('Building a service worker that is not actually handling fetch events!'));
		}
		swprecache.generate({
			staticFileGlobs: [
				`${paths.build}/*.min.js`,
				`${paths.build}/*.min.css`,
				`${paths.build}/**/*.html`,
				`${paths.build}/assets/**/*.svg`,
				`${paths.build}/avatars/*.jpg`,
				`${paths.build}/favicon*.png`,
				`${paths.build}/manifest.json`
			],
			stripPrefix: `${paths.build}/`,
			logger: _.util.log,
			// Ignore all request params, since all resources have a cache request param
			// and we don't use request params anywhere to actually serve different files.
			ignoreUrlParametersMatching: [/./],
			runtimeCaching: [
				{ urlPattern: /^chrome-extension/, handler: 'networkOnly' }, // ignore chrome-extensions
				{ urlPattern: /.*/, handler: 'networkFirst' }
			],
			verbose: true,
			handleFetch: handleFetch
		}).then(swstring => {
			fromString('sw.js', swstring)
				.pipe(_.uglify())
				.pipe(gulp.dest(paths.build))
				.on('end', done);
		});
	});

	return {
		build: 'serviceworker'
	};

}
