---
title: Writing Kibana 4 Plugins – Visualizations using Data
created: 2015-12-06T11:22:43
authors:
  - timroes
slug: writing-kibana-4-plugins-visualizations-using-data
image: /banners/kibana-plugin-banner.png
series: kibana-plugins
category: Kibana
summary: |
  This tutorial series explains how to create own Kibana plugins. This part explains
  how to create a simple tagcloud visualization.
---

[[hintbox You need to read [Part 2 - Simple Visualization](post:plugins-02-visualizations)
before you read this tutorial.]]

In the [previous part](post:plugins-02-visualizations) of this tutorial series
(which is a required must-read for this part) you've learned to create a simple
visualization, that doesn't need access to data from Elasticsearch. In this part
we will write another plugin, that uses aggregations (like most of the
visualizations) to access data from Elasticsearch.

We will create a very simple tag cloud plugin, that shows the bucket name as a
label and the result of the metrics aggregation determines the fontsize of the
tag. If you are feeling unfamiliar with bucket and metrics aggregations have a
look at my [Kibana 4 Visualize](post:part3-visualize)
tutorial.

The sources of this tutorial can be found on GitHub:

[timroes/tr-k4p-tagcloud](github:timroes/tr-k4p-tagcloud)

We will use the name **tr-k4p-tagcloud** throughout this tutorial. You have to
replace it with your appropriate unique plugin name.

## The tagcloud visualization

First of all you should of course think what data you want to visualize in what
way. This means, you should now what kind of bucket and metrics aggregation will
result in what visualization.

We keep our visualization very simple and allow exactly one bucket and one
metric aggregation. The bucket aggregation will determine which tags will be
shown (each bucket will result in one tag). The metrics aggregation will result
in the font size of the tag of each bucket, i.e. the higher the metric
aggregations result the larger the bucket tag will be shown.

It is important for you to think about how many metrics or bucket aggregations
you want to visualize and if you can nest aggregations, etc. You will need to
define this later in your plugin.

## Define and register you visualization

As in the previous part, the first steps are to create the `index.js`, `package.json` and register a simple visualization provider. We will just show highlight the visualization provider (which can be found in the `public/tagcloud.js` file):

```js
function TagcloudProvider(Private) {
  var TemplateVisType = Private(require('ui/template_vis_type/TemplateVisType'));

  return new TemplateVisType({
    name: 'trTagcloud', // The internal id of the visualization (must be unique)
    title: 'Tagcloud', // The title of the visualization, shown to the user
    description: 'Tagcloud visualization', // The description of this vis
    icon: 'fa-cloud', // The font awesome icon of this visualization
    template: require('plugins/tr-k4p-tagcloud/tagcloud.html')
  });
}

require('ui/registry/vis_types').register(TagcloudProvider);
```

There are two changes to the previous tutorial part:

* We leave out the `define()` block (AMD module definition) around the plugin.
  As mentioned in the previous part, this is not needed anymore due to bundeling
  with webpack. That also means, you don't return the provider function anymore inside the module.
* We leave out the `requiresSearch: false` in the definition of the visualization.
  Our tagcloud will use data from Elasticsearch, so you should be able to link it
  to a search like all other visualizations that consume data. Since
  `requiresSearch: true` is the default value we can just leave the key.

You will need to create the public/tagcloud.html file, but can leave it empty
for now. You can find the first step in tag
[0.1.0](https://github.com/timroes/tr-k4p-tagcloud/tree/0.1.0) in the GitHub
project.

## Define your schemas

For a visualization that uses data aggregation, you need to specify exactly what aggregations your visualization needs or is allowed to have. These so called schemas will be added to the visualization description. Let's modify our description as follows:

```js
function TagcloudProvider(Private) {
  var TemplateVisType = /* ... */;

  // Include the Schemas class, which will be used to define schemas
  var Schemas = Private(require('ui/Vis/Schemas'));

  return new TemplateVisType({
    /* every attribute shown above */,
    schemas: new Schemas([
      {
        group: 'metrics',
        name: 'tagsize',
        title: 'Tagsize',
        min: 1,
        max: 1,
        aggFilter: ['count', 'avg', 'sum', 'min', 'max', 'cardinality', 'std_dev']
      },
      {
        group: 'buckets',
        name: 'tags',
        title: 'Tags',
        min: 1,
        max: 1,
        aggFilter: '!geohash_grid'
      }
    ])
  });
}
```

To define your schemas, you create a new `Schemas` object, which will take an
array of objects in its contructor. Each object describes one aggregation you
accept for your visualization. Each aggregation object have the following keys:

* **group** \- either "metrics" or "buckets". Will define, which kind of
  aggregation you want to describe in this object.
* **name** \- the name (id) of this aggregation. You can use this later to get a reference to the different aggregations again.
* **title** \- the title shown to the user, when he adds the aggregation. Should describe how that aggregation will be visualized (e.g. in that case the bucket aggregation will create tags, the metrics aggregation will influence the tag size)
* **min/max** \- the number of minimum and maximum aggregations of that type, a user can add. E.g. the vertical bar chart has a bucket aggregation for "Split Bars". It is not limited (i.e. no _max_ value specified) since it can split the bar as many times as the user wishes. In our case we only allow 1 aggregation of each type, due to the way our visualization works.
* **aggFilter** \- a filter on which aggregations should be allowed. It is an array of either aggregation types (see below), that are allowed in this place (as shown in our metrics aggregation) or an array of aggregation types forbidden (each must be prefixed with a bang). In the later case all other aggregations are allowed. If the array has only one element you can also specify it as a string (as shown in the bucket aggregation).

There are some more keys you can specify in the aggregation, which we won't
cover in this tutorial.

The types, that you can specify for metrics aggregations' `aggFilter` are the
following: **avg, cardinality, count, max, median, min, percentile_ranks,
percentiles, std_dev, sum**

The types, that you can specify for bucket aggregations' aggFilter are the
following: **date_histogram, date_range, filters, geohash_grid, histogram,
ip_range, range, significant_terms, terms**

If you load this plugin inside Kibana you should now be able to chose
aggregations as you described, when creating a new visualization of your type.

You can find the sources of this step in tag
[0.2.0](https://github.com/timroes/tr-k4p-tagcloud/tree/0.2.0) on GitHub.

## Writing the controller

To add logic to our visualization we will again need an Angular controller. In contrast to the previous part we will extract it into its own file (since it will be a bit larger). Therefor just add the following line to the head of your `tagcloud.js` file:

```js
require('plugins/tr-k4p-tagcloud/tagcloudController')
```

Now you can create a new file `public/tagcloudController.js` with an empty controller:

```js
var module = require('ui/modules').get('tr-k4p-tagcloud');
module.controller('TagcloudController', function($scope) {
  // Your logic will go here
});
```

To load the controller modify your template (`public/tagcloud.html`) as follows:

```html
<div ng-controller="TagcloudController"></div>
```

Now we have an empty controller, that will be loaded for our visualization.

### Accessing data

There are two variables inherited into your angular scope, that you will need.
One is the vis variable, already seen in the last part of the series, which
holds information about your visualization and the settings the user chose. The
other variable is named `esResponse` and holds the Elasticsearch response for
your visualization. Kibana will automatically query Elasticsearch with the
aggregations set by the user and taking into account currently set queries and
filters.

To visualize our data we need to match the response data with the user
configuration for our widget. To access the result of the aggregations we can
look into `$scope.esResponse.aggregations`. To find aggregations in that object
we need their ids. To find the ids for a specific aggregation we can use several
methods of `$scope.vis.aggs` to find the id.

In our case we first want to extract all the buckets (i.e. the tag names) from
the response. You can access the id of the configured tags aggregation as
follows:

```js
$scope.vis.aggs.bySchemaName['tags'][0].id
```

The bySchemaName object contains a mapping of the names (that you have specified
in your schema) to the aggregation configuration. Accessing the tags key will
give us an array of all the aggregation configurations the user has entered for
tags. Since we have set min and max to 1, we know, that there is only one object
and can retrieve its id. We can use that id to lookup the results in
`esResponse`.

You generally want to create a watch on the `esResponse` variable and update your
data when that variable changes. So let’s put everything together to show a
simple list of tags:

```js
$scope.$watch('esResponse', function(resp) {
  if (!resp) {
    $scope.tags = null;
    return;
  }

  // Retrieve the id of the configured tags aggregation
  var tagsAggId = $scope.vis.aggs.bySchemaName['tags'][0].id;
  // Get the buckets of that aggregation
  var buckets = resp.aggregations[tagsAggId].buckets;
  // Transform all buckets into tag objects
  $scope.tags = buckets.map(function(bucket) {
    return {
      label: bucket.key
    };
   });
});
```

That way $scope.tags will have an array ob objects (one for each bucket) with
the bucket key as a label. You can now change your tagcloud.html accordingly:

```html
<div ng-controller="TagcloudController">
  <span ng-repeat="tag in tags">{{tag.label}}</span>
</div>
```

You can find the full version (with some CSS added) in
[0.3.0](https://github.com/timroes/tr-k4p-tagcloud/tree/0.3.0) in the
repository.

Accessing the metrics aggregation is a little bit easier, but follow similar
steps. First we need to get a reference to the metrics aggregation we want to
read out for the bucket:

```js
var metricsAgg = $scope.vis.aggs.bySchemaName['tagsize'][0];
```

Notice, that we don’t read out the id, but the whole aggregation object in that
case. Again we can just access, the first element in the array, since we only
allowed one metrics aggregation to be configured. We can now complete mapping
the buckets with the value from the metrics aggregation:

```js
$scope.tags = buckets.map(function(bucket) {
  return {
    label: bucket.key,
    value: metricsAgg.getValue(bucket)
  };
});
```

We can use the `getValue` method on an metrics aggregation object and pass in
the bucket to return the value of this metrics aggregation for the specified
bucket. After this we have a list of tags with label and a value. The last thing
we need to do now is to calculate a font size for each tag. To do this we will
calculate the minimum an maximum value of all tags while collecting the tag
array and use a minimum and maximum font size to calculate afterwards the font.
Since this is not anyhow Kibana specific, but some regular AngularJS JavaScript,
we won’t show it here, but you can look into the tagcloudController.js and
tagcloud.html file in version
[0.4.0](https://github.com/timroes/tr-k4p-tagcloud/tree/0.4.0) on GitHub.

### Accessing data sum-up

The tag cloud is a pretty easy example of how to access data. It only has one
bucket aggregation and one metrics aggregation. No multiple aggregations, no
nested aggregations, etc. In a more complex visualization you might have all
that. So let’s try to generalize the process a little bit:

* You can get access to the configured visualization objects via `$scope.vis.aggs`
  and the different sub methods: `bySchemaName` (the names you configured in your schema),
  `bySchemaGroup` (metrics or buckets), `byTypeName` (e.g. count, terms, etc.)
* To access data inside a bucket you can use the `getValue` method on the aggregation object.

In general there are some more methods, that might become useful in more complex
visualizations (e.g. you could also get the key of a bucket, by using the
aggregation object’s `getKey` method). To find out these methods, you will need to
wait for some official plugin development documentation, grep the Kibana source
code or (what often works best) setting yourself breakpoints during development
and just inspect the objects in your browsers dev tools.

## Adding filters on click

The last feature we would like to add to our tag cloud is filtering. If the user
clicks on a tag, a filter for that value should be automatically added to the
dashboard.

First step to create a filter is to retrieve the filter manager service. We will
use the Private service (which is responsible for instantiating angular services
from required modules, as explained in the previous tutorial part) to
instantiate the filter service. The required modifications at the controller:

```js
module.controller('TagcloudController', function($scope, Private) {
  var filterManager = Private(require('ui/filter_manager'));
  // ...
});
```

The filter manager has one method called add which we can utilize to create a
new filter. First let’s change the HTML to call a method if the user clicks a
filter:

```html
<span ng-click="filter(tag)" ng-repeat="tag in tags" ...>
```

Now we can implement the filter method:

```js
$scope.filter = function(tag) {
  // Add a new filter via the filter manager
  filterManager.add(
    // The field to filter for, we can get it from the config
    $scope.vis.aggs.bySchemaName['tags'][0].params.field,
    // The value to filter for, we will read out the bucket key from the tag
    tag.label,
    // Whether the filter is negated. If you want to create a negated filter pass '-' here
    null,
    // The index pattern for the filter
    $scope.vis.indexPattern.title
  );
};
```

You can find this last step of the plugin in version
[0.5.0](https://github.com/timroes/tr-k4p-tagcloud/tree/0.5.0) on GitHub.

## What’s next?

Now you are able to write your first visualization, that consumes data from
Elasticsearch. If you write your visualization always keep in mind, what schemas
you really can visualize and make sure you only allow schemas, that you actually
also check for in your code. So if you allow multiple bucket aggregations, make
sure to visualize every bucket, you will get from
`$scope.vis.aggs.bySchemaName['foobar']` and not just the first one, as we did.
