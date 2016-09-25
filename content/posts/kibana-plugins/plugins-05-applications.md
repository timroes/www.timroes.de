---
title: Writing Kibana Plugins – Custom applications
created: 2016-02-21T08:53:19
authors:
  - timroes
slug: writing-kibana-plugins-custom-applications
image: /banners/kibana-plugin-banner.png
series: kibana-plugins
category: Kibana
summary: |
  This tutorial series explains how to create own Kibana plugins. This part explains
  how to create a custom application plugin.
---

[[hintbox]] You need to read [Part 1 - Basics](post:plugins-01-basics) before you
read this tutorial.

This part of the tutorial series covers the creation of custom applications in
Kibana. An application is one possible component inside a plugin, which is a
complete own part inside the Kibana platform that you can put whatever you want.
Kibana is just giving you a link to this part and you can design it whatever you
feel like. One famous example of this is the
[timelion](https://github.com/elastic/timelion) plugin by Elastic.

In this tutorial we will build a very simple Elasticsearch status page
application. It will just list all indices and clicking on one will bring you to
a page with stats about that index. You can see the final result in the
animation below.

![A short animation how the final app would look like](/kibana-plugins/kibana-app.gif)

In this tutorial we will learn:

* how to create the basic structure of an application plugin
* how to communicate with elasticsearch properly from your plugin
* how to create multiple subpages in an application and navigate between them

The source code of the complete plugin can be found on GitHub. I used a lot of
ECMAScript 2015 Syntax for this plugin. Kibana bundles your plugins files with
Webpack anyway, so you can safely use ECMAScript 2015 and it will be transpiled
to ES 5 JavaScript by Kibana.

[timroes/elasticsearch_status](github:timroes/elasticsearch_status)

## New Kibana 5 design

As you might have noticed, the Design of the Kibana above might look pretty
uncommon to you (yet). This is the new UI of Kibana 5 that hasn't been released
yet. Everything shown in this tutorial also works on Kibana 4 and I will show up
differences between the old and new design that are relevant for plugin
development during the tutorial.

## Creating the basic structure

We have seen the `index.js` in the previous parts of this series. To register a new app component you use the `app` key inside the `uiExport` object as follows:

```js
export default function (kibana) {
  return new kibana.Plugin({
   require: ['elasticsearch'],

    uiExports: {
      app: {
        title: 'Indices',
        description: 'An awesome Kibana plugin',
        main: 'plugins/elasticsearch_status/app',
        icon: 'plugins/elasticsearch_status/icon.svg'
      }
    }
});
```

Inside the `require` array we can list some other modules, that we use in our module.
The common values are `kibana` and/or `elasticsearch` here. Specifying these will
cause Kibana to always load us after these modules and make sure they are loaded
successfully. We already specify the elasticsearch module here, since we will
use it later in the tutorial to access data from elasticsearch.

Inside the `uiExports` object you specify the app key which itself is again an
object describing the app.

The `title` key is the human readable name of this application. It is what is
shown in the side bar in Kibana (or before Kibana 5 in the application menu
below the icon). The `description` is a description of the application. This
isn't currently used anywhere.

The `main` key is a require string for the main javascript of your application.
It will always begin with `plugins/<your plugin id>/` and followed by the name
of the JavaScript file inside the `public` folder of your plugin, e.g. in the
example above, you should have a file` public/app.js` in your plugin and the
plugin id in `package.json` should be `elasticsearch_status`.

The `icon` key refers to an icon for this application. This will be shown beside
the name in the side navigation (or before Kibana 5 in the application menu). It
is again a string that will be resolved the same as mentioned above.

There exist several other keys you can specify for your app, that has not been
shown above. You can e.g. set `hidden` to `true`, if you don't want the app to
show up in the navigation (e.g. the Kibana status page is such an app).

## Creating a new Server API

If you want to query Elasticsearch from your application the clean solution
would be to give the Kibana server a new API. You call this API from your
application and it will query Elasticsearch for you.

Why not query Elasticsearch directly from your application? Of course you could
also use the Elasticsearch JavaScript client to query ES directly from your
frontend. But these calls would be executed in the browser of the user causing
CORS (Cross Origin Resource Sharing) problems again. The clean solution is to
use the Kibana server for this.

So as described above our application would need to get a list of all indices
and would need to retrieve the stats of a specific index. Let's have a look at
the second interface.

To add new server APIs to Kibana, there is an `init` method that you can specify:

```js
// ...
return new kibana.Plugin({
  // ...
  init(server, options) {
    // Initialization goes here
  }
});
```

If you are not so familiar with modern JavaScript syntax yet, this is just a shortcut for writing `init: function(server, options) {...}`.

The server object that's passed to that method is actually an [hapiJS](http://hapijs.com/api) server object. You can create new interfaces as follows:

```js
// inside your init method:
server.route({
  path: '/api/elasticsearch_status/index/{name}',
  method: 'GET',
  handler(req, reply) {
    // more to come here in the next step
    reply("Hello World");
  }
});
```

That way you create a new GET API at the Kibana server. You could now call the
`/api/elasticsearch_status/index/<some index name here>` interface (that
doesn't do anything yet). The handler method will get two parameter: the first
is the request, that has been made. You can access a lot from the request here
(e.g. using `req.params.name` you would get the name of the index that has been
passed in the URL). The second parameter is the reply function. You must call
this function and pass it the data that should be returned to the client, that
calls this API.

For a full documentation check out the official
[hapi documentation](http://hapijs.com/api#serverrouteoptions) for the route method.

### Querying Elasticsearch

Now we need to somehow actually query Elasticsearch from within the handler
method to retrieve the data about the index. There is a utility method to call
Elasticsearch, that we can use. This method is also the reason why we put a
require to the elasticsearch module in our index.js. The following code would go
inside the handler function of our API:

```js
server.plugins.elasticsearch.callWithRequest(req, 'cluster.state', {
  metric: 'metadata',
  index: req.params.name
}).then(function (response) {
  reply(response.metadata.indices[req.params.name]);
});
```

We need to pass the request from our API as a first parameter to the
`callWithRequest` method. This method e.g. takes care of passing authentication
between the calls to the Kibana server and calls to the Elasticsearch. The
second parameter is the name of the function from the [Elasticsearch JavaScript
client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)
we want to call - in our case we want to call the `cluster.state()` method and
we want to pass the index (read out from the request parameter) to the method.

This method returns a promise that will be resolved with the response from
Elasticsearch. Inside the resolve function we will then just extract the data we
need from the response (in our case the index stats) and return it (via the
`reply` method).

That way we have created our first Kibana server API, that is now ready to be
called. If you watch into the source code on GitHub you will notice, that I
extracted the API generation to another module and just called this method from
inside the init method. I would recommend doing this to keep your code readable –
if you have a lot of APIs you create, you might even want to use more than one
module for it.

The second server API (for getting a list of all indices) can be found in the
source code. I won’t go into detail inside this blog post, since we already
covered all topics, you could write it yourself.

## Creating the frontend

Last but not least we should create the actual frontend for our application.
We’ve registered earlier a specific `app.js` inside our `index.js` as the main file.
Now its time to create it and fill it with some content.

The first two lines we will insert into the file are the following:

```js
import 'ui/autoload/styles';
import './less/main.less';
```

The first line is important **if you use Kibana 5** and you should always have it in an application
plugin. It will cause Kibana to load all the styles it usually has. If you don’t
import (or require if you prefer ES5 syntax) this module, the Kibana frame
around your application will look broken when the user enters your application.
**If you use Kibana 4** this file doesn't exist and you cannot import it (which
brings us back to the huge warning in the first post, about the lack of a stable public API).

The second line is optional and shows how to insert own LESS styles for your
application. You just import your LESS file. You could also use SASS instead. I
recommend using relative paths for those files that are also in your public
folder, so you don’t need to repeat your plugin id over and over again.

### Creating routing options

Kibana uses AngularJS’ ngRouter for routing between pages. If your application
wants to use routing, you have to enable it explicitly and configure some routes
in your `app.js` file:

```js
import uiRoutes from 'ui/routes';

import overviewTemplate from './templates/index.html';
import detailTemplate from './templates/detail.html';

uiRoutes.enable();
uiRoutes
.when('/', {
  template: overviewTemplate,
  controller: 'elasticsearchStatusController',
  controllerAs: 'ctrl'
})
.when('/index/:name', {
  template: detailTemplate,
  controller: 'elasticsearchDetailController',
  controllerAs: 'ctrl'
});
```

The call to `uiRoutes.enable()` is mandatory if you need to use routing. After
that you can use `when` and `otherwise` calls like you are used from
`$routeProvider`. In this case we want to configure two routes: one for the base
path and one for the path `/index/:name` which name being the placeholder for an
index name. The templates for both routes can be set by using an `import`
statement above to the actual html files (which are placed in the `templates`
folder in our case). We also use two controllers, which we haven’t written yet.

So to write them we just use the global Angular module registry Kibana is using:

```js
import uiModules from 'ui/modules';

uiModules
.get('app/elasticsearch_status')
.controller('elasticsearchStatusController', function ($http) {
  $http.get('../api/elasticsearch_status/indices').then((response) => {
    this.indices = response.data;
  });
});
```

The uiModules is a central service in Kibana taking care of all the Angular
modules in the application. If we want to get or create one, use its `get`
method. The first parameter is the name of the module we want to get or create.
The service will take care of either returning the module if it already exists
or creating it if it doesn’t. The second parameter can be an array of modules,
our module depend on. If the module already exists, these will be added to the
dependency list of the module before its returned. It the modules doesn’t exist
it will just add them to the newly created module.

As you see this behaviour is different from the angular.module method, where you
create a module when you specify dependencies and get one when you don’t pass a
second parameter. Using this service Kibana also takes care about loading our
Angular module.

The controller itself above just uses the `$http` service to get the list of
indices from our interface and store it at the controller.

The last missing part is now our template in `templates/index.html`:

```html
<div class="container">
  <div class="row">
    <div class="col-12-sm">
      <h1>Elasticsearch Status</h1>
      <ul class="indexList">
        <li ng-repeat="index in ctrl.indices">
          <a href="#/index/{{index}}">{{ index }}</a>
        </li>
      </ul>
    </div>
  </div>
</div>
```

The HTML is kept pretty simple in our tutorial. We just use `ng-repeat` to iterate
over all the indices, that we retrieved from the API and link to them. Also we
use some of the Bootstrap’s CSS classes to style our content. The HTML for the
detail page can be found in the source code on GitHub.

In Kibana 5 onwards Kibana will only give you the side navigation as seen above
in the screenshot. There is no header bar or anything anymore once you have been
switched to your plugin. If you want that kind of styling you will have to
create it yourself in your application. Prior to Kibana 5 you still get the bar
and can modify it via a service:

```js
import chrome from 'ui/chrome';

chrome
.setNavBackground('#FF00FF') // Turns the navbar in beautiful pink
.setBrand({
  logo: '<CSS background property value for the logo>',
  smallLogo: '<CSS background property value a smaller version>'
});
```

There are some more methods to create tabs, etc. But when you developing an
application component keep in mind, that those things are gone in Kibana 5 (as
of today) and your application might not be usable anymore because you are
lacking a tab navigation that you relied on.

## What’s next?

With this pretty simple app component we’ve covered a lot of the APIs you
require to build your own awesome app component plugin. So now it’s up to you to
build the next timelion.
