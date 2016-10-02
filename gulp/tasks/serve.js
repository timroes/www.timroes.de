import compression from 'compression';
import slow from 'connect-slow';
import cache from 'cache-control';

export default function(gulp, paths, _) {

	function failFile(filename) {
		return (req, res, next) => {
			if (new RegExp(`^${filename}`).test(req.url)) {
				_.util.log(_.util.colors.yellow(`Returned error 500 for ${filename}`));
				req.statusCode = 500;
				res.end();
			} else {
				next();
			}
		};
	}

	function delayFile(filename) {
		return slow({
			url: new RegExp(`^${filename}`),
			delay: 5000
		});
	}

	const middlewares = [
		// Always add gzip compression
		compression({
			threshold: '0b'
		}),
		cache({ '/**': 500 })
	];

	if (_.util.env['delay-main-css'] !== undefined) {
		middlewares.push(delayFile('/main.min.css'));
	} else if (_.util.env['main-css'] === false) {
		// Disable delivery of main css (only above the fold css will be delivered)
		middlewares.push(failFile('/main.min.css'));
	}

	if (_.util.env['delay-images'] !== undefined) {
		middlewares.push(delayFile('/images/.*'));
	} else if (_.util.env['images'] === false) {
		middlewares.push(failFile('/images/.*'));
	}

	gulp.task('serve', () => {
		_.connect.server({
			root: paths.build,
			livereload: true,
			middleware: () => middlewares
		});
	});

	return {
		dev: 'serve'
	};

}
