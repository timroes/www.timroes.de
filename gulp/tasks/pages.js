import pages from '../data/pages';
import {pageData} from '../handlebarData';
import merge from 'merge-stream';
import runSequence from 'run-sequence';

export default function(gulp, paths, _, watch, pipelines) {

	gulp.task('pages', ['resources'], (done) => {
		runSequence('pages-no-deps', done);
	});

	gulp.task('pages-no-deps', () => {
		const pageStreams = pages().map(page => {
			return gulp.src(paths.sources.index)
				.pipe(pipelines.handlebars(pageData(page)))
				.pipe(_.rename(page.url + '/index.html'))
				.pipe(pipelines.html());
		});

		return merge(...pageStreams)
			.pipe(gulp.dest(paths.build))
			.pipe(_.connect.reload());
	});

	watch([
		paths.sources.index,
		paths.sources.templates,
		paths.content.pages
	], ['pages-no-deps']);

	return {
		build: 'pages'
	};

}
