export default function(gulp, paths, _, watch) {
	gulp.task('assets', () => {
		const svgFilter = _.filter('**/*.svg', { restore: true });
		return gulp.src(paths.sources.assets, { base: paths.src })
			.pipe(svgFilter)
			.pipe(_.svgmin({
				plugins: [
					{ cleanupIDs: false }, // Don't remove or rename IDs (for icon usage)
					{ removeUselessDefs: false } // Don't remove unused defs (due to icon SVGs)
				]
			}))
			.pipe(svgFilter.restore)
			.pipe(gulp.dest(paths.build));
	});

	watch(paths.sources.assets, ['assets']);

	return {
		resources: 'assets'
	};

}
