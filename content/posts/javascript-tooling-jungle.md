---
title: A Way Through the JavaScript Tooling Jungle
created: 2016-10-03T17:00:00
authors:
  - timroes
slug: javascript-tooling-explained
category: Web
image: /banners/js-tooling.svg
summary: |
  Modern web projects often use a large stack of build tools.
  This post help starters understanding what the different tools do and how
  they interact with each other.
---

When being new into JavaScript development the wide range of tools you need,
or at least are used in a lot of projects, might be confusing. You just might want
to start a simple project and hear about Node, gulp, LESS, Webpack, UglifyJS, Babel and more.
Especially if you come from a language like Java, where you have build systems like
Gradle, it might become very confusing that you have to use several different
tools to do the "same" in JavaScript.

In this post I want to explain how these different tools interact with each other and what each of it does.
If you are missing a tool, you would like to see explained in this post, please
feel free to leave a comment below.

![Node.js Logo:](/logos/node.svg)

**[Node.js](https://nodejs.org)** is a runtime (based on v8, the JavaScript engine in Chrome)
to execute JavaScript code on your desktop (or server) and is the de facto standard for
JavaScript tools on the desktop. Since quite a lot of the tools used in web development
are written in JavaScript, you usually need Node.js installed for a development
environment.

To install and manage multiple Node versions, [nvm](https://github.com/creationix/nvm) has
become very popular. It also allows you to install any Node versions without admin
permissions.

Package manager
---------------

![NPM Logo:](/logos/npm.svg)

**[npm](https://www.npmjs.com/)** (node package manager) is a tool, that usually
comes with Node and is responsible for downloading "packages" from a central registry.

Those dependencies can be runtime dependencies if you develop a server application in JavaScript (e.g.
the express framework). They can also be the tools you actually need to build, which we will
see in the following sections.

When it comes to runtime dependencies you need in your frontend (e.g. jQuery, lodash, Angular, React, etc.),
there is **[bower](https://bower.io/)**. Bower is a package manager, focusing on the
libraries, that are actually transfered to your users browser.

A lot of those frontend libraries are nowadays also available via npm and I've seen more
and more projects moving away from bower and downloading those libraries also via npm
to get rid of at least one of the tools in this jungle. Personally I also prefer
downloading everything via npm and haven't used bower since mid 2015 anymore for new
projects.

The project configuration of `npm` is stored in the `package.json` file in the project's
root directory. It contains a list of all the dependencies, that npm should download
for this project, some meta information about the project, like version, name and authors.
You can also use npm to execute some scripts, that can be described via a `scripts`
object inside the `package.json`. That way you can e.g. use `npm run test` to run
tests on your project, by placing a command into your `package.json`, that will execute
the tests.

Build systems
-------------

There are a bunch of "build systems" out there. Most of the build systems in the
JavaScript world are actually *task runners*, which "just" execute several tasks
and manage the dependencies between these tasks (i.e. which has to run after which
other task). The actual tasks are usually just calls to other libraries (e.g. compiler,
minificator, etc.) which do the actual work.

The two most popular task runners are [Gulp](http://gulpjs.com/) and [Grunt](http://gruntjs.com/).
Grunt uses a more configuration like approach whereas Gulp use the code over configuration
approach. Some other tools, but not quite as widespread, in this category are [Broccoli.js](http://broccolijs.com/)
or [Brunch](http://brunch.io/).

All of these are bringing their own configuration file: `gulpfile.js`, `Gruntfile.js`, `Brocfile.js` and `brunch-config.js`.
In these you configure which resources need to be processed by which plugins
and in what kind of files output it bundled (since this isn't something standardized
in the JavaScript world).

Usually the tools behind these plugins (e.g. the CSS preprocessor LESS)
are plain node modules and every build system has its own wrapper around it,
making the tool usable within the build system. All of the below mentioned tools
are available in these build systems and can be used inside them to process your
sources.

JavaScript Compilers
--------------------

Usually one part inside your buildsystem is a compiler of some kind.
If you us some language beside JavaScript (like TypeScript or CoffeeScript) you
require their compilers to compile that language down to JavaScript, which than
can be executed in a browser. Also without using another language you often want
to use some up-to-date JavaScript, but have to support some (older) browser, which
doesn't support those new JavaScript features yet.

![Babel Logo:](/logos/babel.svg)

There are two popular compilers to compile modern JavaScript to "old" JavaScript
(aka compile ECMAScript2015 upwards to ECMAScript5): **[Babel](https://babeljs.io/)**
and **[Traceur](https://github.com/google/traceur-compiler)**, with the former being
a bit more popular und used from my observations. Babel is also used to compile
JSX (a special dialect used in the famous React framework) to regular JavaScript.
You can configure babel to activate (or deactivate) support for special modern
JavaScript features. This can be done via the `.babelrc` file in the project
directory or via passing options to it inside the build system you use.

Other JavaScript Tools
----------------------

Besides compiling your JavaScript (or other language) to commonly understood JavaScript,
there are some other tools, that are widely used in building web applications.

**[UglifyJS](https://github.com/mishoo/UglifyJS2)** is a commonly used postprocessor
for JavaScript, that will minify your code in size, remove unused and dead code - kind
of what *ProGuard* does in the Java world. If you are interested in advanced loading size
optimizations, you can also have a look at my [Optimizing your webpage for 10k](post:optimizing-for-10k)
article.

**[ESLint](http://eslint.org/)** and **[JSHint](http://jshint.com/)** are linting tools,
that will check your code for possible bad (or even buggy) code. They also offer options
to enforce coding styleguides in your code.

JavaScript Bundlers
-------------------

Using modules is a common technique to structure your source code. There are
libraries, that can load these modules in the browser, like [RequireJS](http://requirejs.org/).
But often you would like to bundle all modules into a few or a single bundled JavaScript files,
so the browser doesn't need to make hundreds of requests to fetch all required modules.

![webpack Logo:](/logos/webpack.svg)

To bundle all those files together there are mainly three famous tools: **[webpack](https://webpack.github.io/)**,
**[SystemJS](https://github.com/systemjs/systemjs)** and **[Browserify](http://browserify.org/)**.
SystemJS and RequireJS are both hybrid solutions, that can bundle your code during building
or run in the browser and requesting module files on the fly. Though I've barely ever
seen anyone using RequireJS as a bundler. From the projects I've seen in the last years and from
GitHub stats, webpack kind of outruns the others.

JavaScript does know several different syntax to import modules, e.g. `require('module')` called
*CommonJS* or `import 'module'` from the ECMASCript2015 specification. Those bundlers
usually understand more than one syntax how modules can imported. They will get one or multiple
input files and from there on include the modules/files, that are imported, into one (or multiple)
output bundles.

Since the bundler is traversing your source code while bundeling and knows which files are actually in the output,
the compiling - if you require a compiler as mentioned above - will now done be as part of this traversing.
That's why e.g. webpack has several so called [loaders](https://webpack.github.io/docs/list-of-loaders.html#dialects)
to use Babel, TypeScript or CoffeeScript for compiling.

Besides compiling the bundlers also have several plugins for pre- and postprocessing
the files, so that you can - and often it makes sense to - do a lot of the other
optimizations (like using UglifyJS) as part of the bundeling process. The range of plugins
bundlers support are growing and so you can also use your CSS preprocessor (see below)
as part of the bundler, and require the CSS files are you would with regular JavaScript
modules. That also means, you will find the configuration of several steps, that
were earlier separated build steps inside the config for your bundler and the bundler
is triggered by your build system.

CSS Build Tools
---------------

Since the CSS as understood by browser out there is still kind of limited (e.g. older browsers
don't have a support for variables, no support for functions, etc.), you will often
see **[LESS](http://www.lesscss.de/)** or **[SASS](http://sass-lang.com/)** as a richer CSS
variant.

Those languages are enhanced CSS variants, which compile down to CSS. There are also
tools like [autoprefixer](https://github.com/postcss/autoprefixer) which help
with better browser support by automatically prefixing your CSS (with `-webkit`, `-ms`, etc.)
for the browsers, you want to support.

Building these files can either be part of your build system, which reads all `.less` or `.scss`
files, compile them and do the requested postprocessing or as mentioned above. They
could also be part of your bundling process, if you decide to import CSS the same way
as modules in your JavaScript files.


Miscellaneous tools
-------------------

There are also a wide range of other tools, around optimization, minification, quality checking,
etc. that you can use in your build process. Some noteable mentions:

* **[imagemin](https://github.com/imagemin/imagemin)** minificate your images
* **[html-minifier](https://github.com/kangax/html-minifier)** compresses your HTML


Generators
----------

Since you have to link up a lot of this tools yourself to create a proper build process,
there are generators and **[yeoman](http://yeoman.io/)** is the de facto standard.

Yeoman is a tool, that several people have written templates for, so that setting up
a new project means just calling one command on the commandline which will then
setup the project structure and create appropriated build files for you.

Personally I am not a big fan of yeoman. It generates a lot of codes inside your build process
and have seen too many projects where people couldn't explain me what specific code
inside their buildfiles does or if it is still needed at all. Also updating those build files
is basically mergin other git branches into it, which is far away from just updating a
plugin inside a buildsystem and everything continues to work.

Résumé
------

To build an up-to-date web project you will need several tools working together.
I hope this article could help starters a bit to understand what these different tools
do and how they are linked to each other.

If you think I have forgotten some noteworthy tools or you don't understand what the part of a specific
tool is in this process, please feel free to leave a comment below.
