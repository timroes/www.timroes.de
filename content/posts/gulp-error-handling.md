---
title: Proper Error Handling in gulp.js
created: 2015-01-06T12:00:00
authors:
  - timroes
slug: proper-error-handling-in-gulp-js
category: JavaScript
image: /banners/gulp-bower.png
---

Some(times) plugins in gulp will hang and silently ignore errors. E.g. I have recognized,
that gulp-less has such a behavior in its current version (2.0.1 at the time of writing).

If you have a simple pipeline with the less plugin in it and a watch, that triggers
that task, the task might not end at all and even worse, no errors show in the log.
You can just notice a missing “Finished ‘<task>’ after <some>ms”.

A plugin named [gulp-plumber](https://www.npmjs.com/package/gulp-plumber) exists,
that helps workaround this broken streams. You can plug in an error handler,
that (a) logs a message and (b) takes care of proper ending the task.

To eliminate the need of adding the error handler to each task you have, I use the
following snippet to overwrite the `gulp.src` method:

```js
var gulp = require('gulp');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

var gulp_src = gulp.src;
gulp.src = function() {
  return gulp_src.apply(gulp, arguments)
    .pipe(plumber(function(error) {
      // Output an error message
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      // emit the end event, to properly end the task
      this.emit('end');
    })
  );
};
```

Of course you will need to install the both required plugins via:

```
npm install --save-dev gulp-plumber gulp-util
```

This way I got all problems fixed with error handling and am able to see what problems gulp-less had.
