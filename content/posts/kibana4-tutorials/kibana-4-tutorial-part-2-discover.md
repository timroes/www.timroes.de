<!--
title: Kibana 4 Tutorial - Part 2: Discover
image: /kibana4-tutorials/kibana-plugin-banner.png
created: 2015-02-07T11:30:00
authors:
  - timroes
  - annaroes
status: draft
-->

A link to [another post](post:foobar2). In the previous part of this tutorial series (which is a required must-read
for this part) you’ve [learned](https://www.google.de) to create a simple visualization, that doesn’t
need access to data from `Elasticsearch`. In this part we will write another plugin,
that uses aggregations (like most of the visualizations) to access data from
Elasticsearch.

[Angular ES6 Sample](github:timroes/angular-es6-sample)

Another test foo bar asdjasdo asdasda sdjoa sda sdo asd asd asdja sdasda sdasd.

![Kibana 4 Discover Tab](/images/kibana4-tutorials/discover-unfiltered.png)

Another chapter
---------------

Test **another** one.

* A list
* with some items

and also a numbered list

1. a numbered list
2. with items

And lets try some code block

```javascript
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

A last chapter
--------------

```
function test() {
  console.log("test");
}
```
