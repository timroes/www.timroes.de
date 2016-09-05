---
title: Writing Kibana 4 Plugins – Simple Visualizations
created: 2015-12-02T21:50:52
authors:
  - timroes
slug: writing-kibana-4-plugins-simple-visualizations
image: /banners/kibana-plugin-banner.png
series: kibana-plugins
category: Kibana
summary: |
  This tutorial series explains how to create own Kibana plugins. This part explains
  how to create a simple visualization that doesn't use any data yet.
---

[[hintbox]] You need to read [Part 1 - Basics](post:plugins-01-basics) before you read this tutorial.

In this part of the Kibana 4 plugin tutorial series, we'll see how to create
simple custom visualizations. The simple visualization we will build won't use
data from Elasticsearch but present "static" content (like the Markdown Vis
does). We will build visualizations, that use data from Elasticsearch in the
upcoming parts. During this tutorial you will learn to build a simple clock
widget, so you can add some time to your dashboards.

The result of this tutorial can be seen in my sample plugin on GitHub:

[timroes/tr-k4p-clock](github:timroes/tr-k4p-clock)

During this tutorial we'll reach several working versions on our way to the
result. I marked these with tags in the repository and will link to them in the
appropriate sections below.

## Register your visualization

To start create the two files `package.json` and `index.js` as described in the
first part of the series. Also remember to chose your package name wisely.

If you want to add a visualization to your plugin, you need to create a
JavaScript file for it. Let's call this file `clock.js` and it needs to be
placed inside the public folder of your plugin.

Before we fill this file with content we need to register it as a visualization
for our plugin. Therefor add the following to your index.js:

```js
module.exports = function(kibana) {
  return new kibana.Plugin({
    uiExports: {
      visTypes: [ 'plugins/<plugin-name>/clock' ]
    }
  });
};
```

Of course you have to replace _&lt;plugin-name&gt;_ with the name of your plugin (also
in all of the upcoming code snippets).

The `uiExports` object describe several extensions your plugin wants to add to
the user interface. In this case we just use the `visTypes` array to register
one (you could also register multiple) visualization types. The string you
define in the visTypes array will be passed to RequireJS for dependency
resolution. RequireJS will resolve `plugins/<plugin-name>/` to the public
folder of your plugin, where you can reference any file you want (in this case
we reference _clock_ which will resolve to the _clock.js_ file).

This is enough to register your visualization to Kibana.

## Define your visualization

After you have registered your visualization the next step is to define it, i.e.
fill the clock.js with some content. To create a simple visualization with a
simple HTML template add the following code to your clock.js:

```js
define(function(require) {
  function ClockProvider(Private) {
    var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));
    return new TemplateVisType({
      name: 'trClock', // the internal id of the visualization
      title: 'Clock', // the name shown in the visualize list
      icon: 'fa-clock-o', // the class of the font awesome icon for this
      description: 'Add a digital clock to your dashboards.', // description shown to the user
      requiresSearch: false, // Cannot be linked to a search
      template: require('plugins/<plugin-name>/clock.html') // Load the template of the visualization
    });
  }

  require('ui/registry/vis_types').register(ClockProvider);

  return ClockProvider;
});
```

As you can see all JavaScript files in the public folder of your plugin should
be RequireJS (AMD) modules and must be wrapped in `define(function(require) { ... })`.

[[hintbox]] **Update**: The writing of this tutorial actually has begun a while
ago. Due to bundeling with Webpack you don't need to wrap your files in AMD
modules anymore. You can just use the require statement without any AMD wrapper.
Thanks to Joe Fleming for that information! Since the source code in the sample
have the wrapper I will also leave it in this tutorial (it doesn't demolish your
plugin), but from the next tutorial part on, you won't see the AMD wrappers
anymore!

First you have to write a provider function for your visualization. This is an
Angular provider function and it's parameters will be auto-injected by Angular).
In this case we just let us inject the **Private** service.

The **Private** service is an Angular service of Kibana that is used to
instantiate or load Angular services from Angular providers. As seen in the next
line we use RequireJS to load the _ui/template_vis_type/TemplateVisType_ which
is an Angular provider and then use the Private service to instantiate the
TemplateVisType from this provider). This is a common pattern in several places
in Kibana to load Angular modules via RequireJS.

 After you've got an instance of the TemplateVisType (which is basically the
type you will need for every visualization, that has a HTML template to show to
the user) your provider function needs to return a new instance of it, which
holds all the information about your visualization.

The **name** field of your template is the internal id used to reference this
visualization. Since this should be unique globally (like the plugin name) you
should prefix it again with YOUR prefix (that's why I used _tr_ again).

The **title** and **description** are shown on the Step 1 page of the Kibana
**Visualize** tab.

The **icon** should be a class name that indicates a [Font Awesome](http://fortawesome.github.io/Font-Awesome/icons/)
icon. It will be used in several places around Kibana.

The **requiresSearch** key is _true_ by default. For a static visualization like
this, that doesn't use data, you should set it to _false_. With it set to false,
Kibana won't show a search box for this visualization and won't ask the user if
she wants to create the Visualization from a new or saved search, which doesn't
make much sense if the vis doesn't use data at all.

The **template** is the HTML of the visualization, more precisely the HTML of
the actual content (not the options editor or something else). We use require
again to import the clock.html file from our plugins public folder. We will
write this file in a moment.

After you have written the provider function, you have to register that provider
function to the registry for vis_types. Yeah, even though you described it
already in your index.js, but this is an [open issue](https://github.com/elastic/kibana/issues/4676)
that might be fixed. You do this as above shown by requiring the registry and call
its _register_ method.

Lastly you can return your provider from the module. You do not need to do this
for the visualization to work, but if you do it, others can require your module
and get access to the provider. Kibana does it for all their visualizations, so
I would recommend to also do it.

## Writing a simple template

The next step is to create the clock.html file in the public folder that was
required as our template above. Let's start with a very simple HTML:

```html
<div class="clockVis"> 15:00:00 </div>
```

This is the first milestone of our plugin. If you load this into Kibana, you
will be able to select a clock from the list, save the vis and add it to your
dashboards like with any other visualization. You will find that milestone in
version [0.1.0](https://github.com/timroes/tr-k4p-clock/tree/0.1.0) on GitHub.

In the HTML of your template you need to wrap everything into an element, i.e.
you are not allowed to place text directly to the root of the HTML file, it
won't be shown.

Unfortunately it currently only shows once a day the correct time and doesn't
look so well yet, so we continue.

## Add styles

To add some styles we add a new file called `clock.css` to our public folder. We
just add some style to center the clock and give it a bit different font styles:

```css
.clockVis {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-weight: bold;
  font-size: 2.5em;
}
```

Everything we need to do now is to require that file in our clock.js file.
Therefor add the following line somewhere into your module (but outside of the
provider function):

```js
require('plugins/<plugin-name>/clock.css');
```

You can also use LESS files for styling, by just changing the file extension.

This (styled) state of the plugin can be found as [0.2.0](https://github.com/timroes/tr-k4p-clock/tree/0.2.0)
on GitHub.

## Add logic to your clock

To improve our plugin even further we want to add logic to the clock. Therefor
we need to attach our own AngularJS controller to the template. Kibana has
wrapped Angular module creation, so to create a module (we should have an own
module for our plugin) and create a new controller in it, you can write the
following in your clock.js:

```js
var module = require('ui/modules').get('<module-name>');
module.controller('ClockController', function($scope) {
  // ...
});
```

The *ui/modules* module has a method called get, that you use to create (or get)
Angular modules. Just give the module its own (unique) name, e.g. your plugin
name. You can specify an array of dependencies as a second parameter to the get
method (the same way you would do with `angular.module`). If you leave the
parameter you don’t require any other module. The most important module you
might need is the kibana module, which gives you access to e.g. the above
mentioned Private service. But we won’t need this for our clock.

In this tutorial we also place this code directly into the clock.js file. In
larger plugins you might want to place it in its own file and just require this
file from your main visualization file (clock.js in this case).

To make our controller complete we use the $timeout service to refresh the
current timestamp every second to the $scope:


```js
module.controller('ClockController', function($scope, $timeout) {
  var setTime = function() {
    $scope.time = Date.now();
    $timeout(setTime, 1000);
  };
  setTime();
});
```

Now you are able to attach your controller to the template and display the time
value as usual in Angular:

```html
<div class="clockVis" ng-controller="ClockController">
  {{ time | date:'HH:mm:ss' }}
</div>
```

If you add your visualization now to a dashboard you will have a working clock.
You can find this milestone in tag [0.3.0](https://github.com/timroes/tr-k4p-clock/tree/0.3.0)
on GitHub.

## Visualization options

There is one improvement left we should implement: give the user options to
change the format of the time that is displayed, i.e. add some options to our
visualization that will be shown when the user edits it.

We’ll first create a template named `clock-editor.html` (in the public folder)
for the options shown in the sidebar:

```html
<div class="form-group">
  <label>Time Format</label>
  <input type="text" ng-model="vis.params.format" class="form-control">
</div>
```

This is again a basic Angular HTML template. In our editor templates (and also
the regular template as seen above) a variable `vis` is available. This is an
object containing information about the visualization instance itself. Inside
this object a key `params` exists. This should be used to store the
parameters.options for the visualization. That’s why we bind our text input to
`vis.params.format` (format is just the name of our setting).

To register the editor template we have to modify the object, that we pass to
the `TemplateVisType` constructor. We add a params key with the following
content (full snippet can be seen on
[GitHub](https://github.com/timroes/tr-k4p-clock/blob/0.4.0/public/clock.js#L34)):

```js
{
  // ...
  params: {
    editor: require('plugins/<plugin-name>/clock-editor.html'),
    defaults: {
      format: 'HH:mm:ss'
    }
  }
  // ...
}
```

We register the template (included via require) that we wrote above and we
define default values for the options we have.

The last thing we need to do now is to use the setting in our main template
(clock.html):

```html
<div class="clockVis" ng-controller="ClockController">
  {{ time | date:vis.params.format }}
</div>
```

As mentioned above the `vis` variable is also available in this template and we
can read the option from it.

Now we’ve just finished our first Kibana 4 plugin:

![A screenshot of the clock plugin](/kibana-plugins/clock-options.png)

You can find the complete sources and a lot of comments in the tag
[0.4.0](https://github.com/timroes/tr-k4p-clock/tree/0.4.0) on GitHub.

## What’s next?

You’ve just created a simple visualization that doesn’t use any data. So the
next step of course is to create a visualization, that uses aggregations etc.
like most of the visualizations do. In the [next part](post:plugins-03-data-visualization) of this tutorial we will
create a simple tag cloud visualization.
