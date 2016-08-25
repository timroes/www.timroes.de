import rawPosts from '../data/rawPosts';
import path from 'path';

export default function(gulp, paths, _, watch, pipelines) {

	gulp.task('images', () => {
		// Get the absolute path of the image folder in the output directory
		const imageBaseAbsPath = path.resolve(`${paths.build}/images/`);
		// Get an array of all banner images with the absolute pathes they will have in the output directory
		const banners = rawPosts().filter(post => post.meta.image).map(post => path.join(imageBaseAbsPath, post.meta.image));

		// A gulp-filter to only match svg files that are used as banenr image in any post
		const filterSvgBanners = _.filter(file => {
			return /\.svg$/.test(file.path) && banners.indexOf(file.path) > -1;
		});

		return gulp.src(paths.content.images)
			.pipe(pipelines.images())
			.pipe(gulp.dest(`${paths.build}/images`))
			.pipe(filterSvgBanners)
			.pipe(_.svg2png())
			.pipe(pipelines.images())
			.pipe(gulp.dest(`${paths.build}/images`));
	});

	watch(paths.content.images, ['images']);

	return {
		resources: 'images'
	};

}
