import pages from '../data/pages';
import render from '../render';
import merge from 'merge-stream';

export default function(gulp, paths, _, watch, pipelines) {

	gulp.task('pages', () => {
		const pageStreams = pages().map(page => {
			const data = {
				page: page,
				type_page: true
			};

			// Render markup to HTML and add to data
			data.page.content = render(page.markup);

			return gulp.src(paths.sources.index)
				.pipe(pipelines.handlebars(data))
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
	], ['pages']);

	return {
		build: 'pages'
	};

}
