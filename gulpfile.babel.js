import gulp from 'gulp';
import yaml from 'yamljs';
import del from 'del';
import merge from 'merge-stream';
import glob from 'glob';
import path from 'path';
import * as posts from './gulp/posts';

const _ = require('gulp-load-plugins')();

const build = 'build/';

const content = {
	posts: 'content/posts/*.md'
};

const src = {
	index: 'src/templates/index.mustache',
	templates: 'src/templates/**/*.mustache',
	scripts: {
		inline: 'src/scripts/inline/**/*.js'
	}
};

gulp.task('posts', () => {

	const postStreams = posts.getAll().map(function(post) {
		return gulp.src(src.index)
			.pipe(_.mustache({
				is_post: true,
				content: posts.render(post.content),
				...post.meta
			}))
			.pipe(_.minifyHtml())
			.pipe(_.rename(post.url));
	});

	return merge(...postStreams)
		.pipe(gulp.dest(build))
		.pipe(_.connect.reload());

});

gulp.task('styles', () => {

});

gulp.task('clean', () => {
	return del(build);
});

gulp.task('watch', () => {
	gulp.watch(content.posts, ['posts']);
	gulp.watch(src.templates, ['posts']);
});

gulp.task('serve', () => {
	_.connect.server({
		root: build,
		livereload: true
	});
});

gulp.task('build', ['posts', 'styles']);

gulp.task('dev', ['build', 'watch', 'serve']);

gulp.task('default', ['build']);