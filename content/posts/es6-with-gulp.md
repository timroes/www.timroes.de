---
title: Using ECMAScript 6 (ES6/ES2015) with Gulp
created: 2015-10-25T12:00:00
authors:
  - timroes
slug: using-ecmascript6-es6-es2015-with-gulp
image: /banners/gulp-es6.png
category: Gulp
tags:
  - Web
---

Did you know that you can easily write your gulpfile in ECMAScript 6 (or ES2015,
or whatever you like to call it)? There are only three steps you need to do:

1. Make sure you are using gulp in at least version **3.9.0**:<br>
   `gulp -v` to check, `npm install -g gulp` to update it
2. Rename your `gulpfile.js` to `gulpfile.babel.js`
3. Save babel (an ES6 to ES5 compiler) as a development dependency to your project:<br>
   `npm install --save-dev babel`

Now you can use ECMAScript 6 syntax and gulp will automatically compile it with
babel when you run gulp.

[[hintbox]] You can also write your gulpfile.js directly in ES6 as long as you have an
up-to-date version of Node.js. But unfortunately you cannot guarantee other
people working on the same project have an updated version, too. The only
requirement for any other user working on your project with this method is an
up-to-date gulp (which is - in my opinion - way easier to update than Node.js).
