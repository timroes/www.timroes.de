import fs from 'fs';
import gulp from 'gulp';
import yaml from 'yamljs';

import paths from './gulp/paths';
import pipelines from './gulp/pipelines';

const gulpPlugins = require('gulp-load-plugins')();

const watchers = [];
const watch = (...args) => {
	watchers.push(args);
};

const depsBuild = [];
const depsDev = ['watch', 'build'];

/*
 Load all tasks from the ./gulp/tasks folder.
 They all need to export a function that takes the following parameters:

 * gulp -> the gulp instance to use
 * paths -> the object of paths to use
 * gulpPlugins -> an object of auto loaded gulp plugins
 * watch -> a watch function that you must use to add watches (same syntax as gulp.watch)

 Each function can return an object that can contain a build and/or dev key, which has
 a task name as a value. This task will be added as a dependency to the build or dev
 task respectively.
 */
const taskFolder = './gulp/tasks';
fs.readdirSync(taskFolder).forEach(function(file) {
	const deps = require(`${taskFolder}/${file}`).default(gulp, paths, gulpPlugins, watch, pipelines) || {};
	if (deps.build) {
		depsBuild.push(deps.build);
	}
	if (deps.dev) {
		depsDev.push(deps.dev);
	}
});

/**
 * Task to watch all fils, that different tasks added to the watcher list.
 */
gulp.task('watch', () => {
	watchers.forEach((watcher) => {
		gulp.watch(...watcher);
	});
});

gulp.task('build', depsBuild);

gulp.task('dev', depsDev);

gulp.task('default', ['build']);
