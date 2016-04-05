---
title: Using ECMAScript 6 (ES6/ES2015) with AngularJS 1.x
created: 2015-07-29T12:00:00
authors:
  - timroes
slug: using-ecmascript-6-es6-with-angularjs-1-x
image: /banners/angular-es6.png
category: AngularJS
---

This tutorial leads through an example on how to build and use AngularJS 1 with
the new JavaScript standard ECMAScript 6 (short ES6 or also ES2015). It does
neither explain how to use AngularJS itself or the new syntax of ES6.

**Why did I do this?** I basically wanted to write an AngularJS 1 (since
AngularJS 2 is still too _beta_ at the time of writing), but wanted to use
some of the nice features of ES6. I came across several solutions when
searching the internet, but none of them fitted my needs completely. So I
proudly present to you solution n+1.

Since I prefer _gulp_ over Grunt as a build tool, I will be using gulp
throughout this tutorial and in the sample project. I assume if you like Grunt,
you will be able to use my gulpfile.js as a reference to setup the build system
in Grunt as well.

If you don't like text, but prefer reading source code you can directly head
over to the sample project on GitHub. We will reference this project during the
following tutorials several times.

[Angular ES6 Sample](github:timroes/angular-es6-sample)

Using most of the ECMAScript 6 features in your project is pretty easy. You
plugin a compiler - Traceur or Babel (more information below) - into
your buildchain and it will just compile your ECMAScript 6 code to ECMAScript 5,
which runs just fine in any modern browser. I stumbled over the first real
problems, when I was trying to use ES6 modules, and using the _import_ statement
to import them from other files. But first things first...

### Traceur vs. Babel

If you want to use ES6 in current projects you most likely want to compile it in
a way, that it runs in most modern browser, i.e. that it compiles to ECMAScript 5.
There are currently two big ES6 to ES5 compilers out there:
[Traceur](https://github.com/google/traceur-compiler) and
[Babel](https://github.com/google/traceur-compiler) (formerly 6to5).

There are several comparisons out there in the web, about the differences, but
in the end I decided for Babel, basically for reason one in
[this](http://stackoverflow.com/a/28447981/1044403) stackoverflow: Traceur needs
a runtime, whereas Babel compiles and includes every polyfill, that it needs
into the ES5 output. So I decided to go with Babel so I have all code required
in the compiled output.

### Building modules

When you want to use ES6 modules (`export`) and import them in another class the
compiler has to do something to these modules, when they are compiled to ES5.
Babel can [convert](https://babeljs.io/docs/usage/modules/) ES6 modules to
CommonJS, AMD, UMD or System modules. The problem is, how are these loaded in
the browser. You could compile to AMD and use a library like RequireJS to load
these modules in the browser.

Since I am used to concat all JS files into one minified app.min.js, I wanted to
have the very same behavior also for ES6.

There is a tool called **[browserify](http://browserify.org/)**, which basically
resolves module dependencies and put them into one file. Browserify supports
transformations and you can plugin Babel via the babelify package. Put
Browserify and Babel(ify) together into one gulp task, it will look as follows:

```js
gulp.task('script', function() {
  var sources = browserify({
    entries: 'src/main/app.js',
    debug: true
  })
  .transform(babelify.configure());

  return sources.bundle()
    .pipe(vinylSourceStream('app.min.js'))
    .pipe(vinylBuffer())
    // Do stuff to the output file
    .pipe(gulp.dest('build/scripts/'));
});
```

You can watch the [full file](https://github.com/timroes/angular-es6-sample/blob/master/gulpfile.js)
in the sample project at Github.

As you might have noticed, you cannot just concat everything to one file and
then let it resolve things like you may have done before, because modules
actually work on a file basis. You need to give Browserify one or more entry
files. It will load the specified entry file(s) and resolve imports.. and
continue resolving imports in the imported files, and so on, until it has
resolved all required modules and put them into one file i.e. one text stream on
which we use vinyl-source-streams and vinyl-buffer to convert it into a stream,
that gulp plugins can work with.

How can we structure our Angular project, so that we will have one single entry
point? We will see in the next chapter!

### Using modules to define components

To be able to import every component as an ES6 module you can create a
controller (let's call this file `MyController.js`) like the following:

```js
export default class MyController {
  constructor() {
    this.name = "Bobby Tables";
  }
}
```

Your main entry file (we named it app.js in the build script above) you can now
define your module and add the controller as follows:

```js
import {MyController} from './MyController.js';

angular.module('myApp', [])
  .controller('MyController', MyController);
```

Using the class and assigning the variables to `this` assumes you are using the
controller-as syntax. If you would still be using the $scope syntax (not
recommended anymore) you can inject the $scope (or any other dependency) into
the constructor of the controller.

To demonstrate dependency injection let's write a service, that requires the $q
service. Let's define a simple _NameService_ in the file _NameService.js_.

```js
export default class NameService {
  constructor($q) {
    this._$q = $q;
  }

  getName() {
    return this._$q.when("Bobby Tables");
  }
}
```

This way you create a class called NameService. The constructor will be used for
dependency injection and you define all the Angular components here, that you
need. If you want to use them in other methods of your class you have to store
them in some fields of the class. You can now register this service the very
same way in the app.js file:

```js
import MyController from './MyController';
import NameService from './NameService';

angular.module('myApp', [])
  .controller('MyController', MyController)
  .service('NameService', NameService);
```

In both of these examples we always created one component per file (which in
most cases makes sense in my opinion). You could also declare multiple
components per ES6 module. An example can be seen in the
[textFilters.js](https://github.com/timroes/angular-es6-sample/blob/master/src/scripts/filters/textFilters.js)
of the sample project (and the
[app.js](https://github.com/timroes/angular-es6-sample/blob/master/src/scripts/app.js)
on how to include it).

If you want to use the NameService in any controller you would still inject it
via Angular's dependency injection (like you would without ES6). But if you have
plain model classes, you can use ES6 import to include them. See the
[PersonService](https://github.com/timroes/angular-es6-sample/blob/master/src/scripts/services/PersonService.js)
for an example. It imports the _Person_ class from the model package. The
_Person_ class is no AngularJS component and not registered to AngularJS.

#### Watching for variable changes

If you use controller-as syntax watching for changes of "scope variables" (which
are actually not on the scope anymore) looks slightly different. This is nothing
that is special to using ES6, but using ES6 makes the code a little bit cleaner.

To watch for a variable change, you need to pass a function, that returns the
variable to `$scope.$watch` instead of its name. Due to ES6 arrow functions you
won't need to bind functions to this and a watch on the name variable looks as
follows:

```js
export default class MyController {
  constructor($scope) {
    this.name = "Bobby Tables";
    $scope.$watch(() => this.name, (newValue) => {
      // Do whatever you want to do
    });
  }
}
```

Unfortunately you still need to inject the $scope service to have access to the
$watch function, but again: that's nothing special to ES6, but to the
controller-as syntax.

### ng-annotate

If you've been using AngularJS for some time, you will most likely be familiar
to [ng-annotate](https://github.com/olov/ng-annotate). This is a tool, which
automatically adds the minification-safe syntax for function calls, i.e. it
transforms `function($scope) {}` to `['$scope',function($scope){}]`. Luckily the
ng-annotate plugin also works with ES6 files. What you have to do is give it
some hints, what functions and classes it needs to transform. If you want a
class transformed, you can use a comment above the contructor like the
following:

```js
export default class NameService {
  /*@ngInject*/
  constructor($q) { .. }
}
```

To annotate functions (if you use any) you can use a string literal:

```js
export default function($scope) {
  'ngInject';
  // ...
}
```

Due to the way babel(ify) transforms the code the comment sadly won't work on
functions in this setup and you need to use the string literal 'ngInject' (which
you could also use inside the constructor of a class, if you prefer it).

With these preparations done you can just plugin ngAnnotate (or
gulp-ng-annotate) into your build system and afterwards uglify the whole app:

```js
gulp.task('script', function() {
  var sources = browserify({
    entries: 'src/main/app.js',
    debug: true
  })
  .transform(babelify.configure());

  return sources.bundle()
    .pipe(vinylSourceStream('app.min.js'))
    .pipe(vinylBuffer())
    .pipe(plugins.ngAnnotate())
    .pipe(plugins.uglify())
    .pipe(gulp.dest('build/scripts/'));
});
```

The sample project also has support for sourcemaps, which are even more helpful,
when you try to debug your ES6 code (which has been compiled to ES5).

### Optional improvements

If you have a quite small project, but still some controllers, services, etc. in
it, your app.js file might get pretty long. A possible solution is, to create a
Controllers module, that only loads all controllers and import this in the main
app. You controllers module could look as follows:

```js
import Controller1 from './Controller1';
import Controller2 from './Controller2';

var module = angular.module('myApp.controllers', [])
  .controller('Controller1', Controller1)
  .controller('Controller2', Controller2);

export default module;
```

If you do the same for your services, you could modify your app.js to only
include these modules as dependencies now:

```js
import Controllers from './controllers/Controllers';
import Services from './services/Services';

angular.module('myApp', [Controllers.name, Services.name]);
```

That way you have splitted up your components into their own modules.

If your project starts to grow you might not want to use a module for
controllers, one for services, etc, but you might want to split your app up by
functional modules, e.g. a user management module, a bill modules (or whatever
your app is about). But the way you can import them stays the same.

I hope this tutorial could show you how and why I build AngularJS 1.x with ES6
the way I do and hopefully it will help you setup your ES6-Angular project. Feel
free to leave a comment if you have feedback or issues with this article (or the
sample project).
