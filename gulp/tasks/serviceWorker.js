import {fromString} from '../utils';
import swprecache from 'sw-precache';

export default function(gulp, paths, _) {
	gulp.task('serviceworker', ['resources', 'posts', 'pages', 'index'], (done) => {
		swprecache.generate({
			staticFileGlobs: [
				`${paths.build}/*.min.js`,
				`${paths.build}/*.min.css`,
				`${paths.build}/**/*.html`,
				`${paths.build}/assets/**/*.svg`,
				`${paths.build}/icons/**`,
				`${paths.build}/avatars/*.jpg`,
				`${paths.build}/favicon*.png`,
				`${paths.build}/manifest.json`
			],
			stripPrefix: `${paths.build}/`,
			// Ignore all request params, since all resources have a cache request param
			// and we don't use request params anywhere to actually serve different files.
			ignoreUrlParametersMatching: [/./],
			runtimeCaching: [
				{ urlPattern: /.*/, handler: 'networkFirst' }
			],
			verbose: true
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
