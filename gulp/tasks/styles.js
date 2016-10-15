import npmImportPlugin from 'less-plugin-npm-import';
import options from '../options';

export default function(gulp, paths, _, watch) {

	gulp.task('styles', () => {
		return gulp.src(paths.sources.styles)
			// if --no-network was specified, remove <ONLY-NETWORK> blocks
			.pipe(_.if(options.noNetwork, _.replace(/\/\/\s*<ONLY-NETWORK>([\s\S]*?)\/\/\s*<\/ONLY-NETWORK>/, '')))
			.pipe(_.less({
				plugins: [ new npmImportPlugin({ prefix: '~' }) ]
			}))
			.pipe(_.combineMq())
			.pipe(_.autoprefixer())
			.pipe(_.cleanCss())
			.pipe(_.rename({
				extname: '.min.css'
			}))
			.pipe(_.size({
				gzip: true,
				showFiles: true,
				pretty: false
			}))
			.pipe(gulp.dest(paths.build))
			.pipe(_.connect.reload());
	});

	watch(paths.sources.stylesAll, ['styles']);

	return {
		resources: 'styles'
	};

}
