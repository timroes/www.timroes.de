---
title: Writing Kibana 4 Plugins – Field Formatters
created: 2016-02-17T20:44:04
authors:
  - timroes
slug: writing-kibana-4-plugins-field-formatters
image: /banners/kibana-plugin-banner.png
series: kibana-plugins
category: Kibana
summary: |
  This tutorial series explains how to create own Kibana plugins. This part explains
  how to create a field formatter.
---

[[hintbox]] You need to read [Part 1 - Basics](post:plugins-01-basics) before you
read this tutorial.

In the previous parts of the tutorial, we mainly focused on how to write custom
visualization types. Beside custom visualizations Kibana has some more extension
points. One of this extensions points are field formatters. A field formatter
can be selected for any field in the settings for a specific index pattern. It
will then be used when displaying the values of this field and it can transform
or present it in another way, then the plain data.

There are some field formatters build into Kibana (e.g. interpreting number
fields as colors, ). This part of the tutorial series covers on how to write
your own field formatter. We'll create a **Trend** field formatter. It will show
an up or down arrow behind the value of a number or percentage field, depending
whether the number is positive or negative. This formatter can then be used on
fields which content represents a trend of any kind. As usual you can find the
result of this tutorial on GitHub:

[timroes/tr-k4p-fieldformatters](github:timroes/tr-k4p-fieldformatters)

## Registering a new field formatter

Registering a new field formatter is similar to registering a new visualization
type (as shown in [part 2](post:plugins-02-visualizations)). You just add a new
array to the `uiExports` in your `index.js` file of your plugin:

```js
// Rest of file stripped (see GitHub for full file)
uiExports: {
  fieldFormats: ['plugins/tr-k4p-fieldformatters/trend']
}
```

This will register the `trend.js` file in your plugin's public folder to the
field formats.

[[hintbox]] **Attention bug ahead**: In all current Kibana releases (as of Kibana
4.4.1) the fieldFormats array is not used correctly. As a workaround for this
Kibana versions just add your field format to the visTypes array instead. It
will work since the trend.js file anyway needs to register itself to the
appropriate registry, so it doesn't matter in which array in the index.js it
appeared. See [#6040](https://github.com/elastic/kibana/issues/6040) on GitHub
for progress on this issue.

## Creating your field formatter

To create the **trend** field formatter, we will now create the `trend.js` file in our plugin's `public` directory (as seen for visualizations in the previous parts of this series). The content of this file will be the following:

```js
function TrendProvider(Private) {

  var _ = require('lodash');
  var FieldFormat = Private(require('ui/index_patterns/_field_format/FieldFormat'));

  _.class(Trend).inherits(FieldFormat);
  function Trend(params) {
    Trend.Super.call(this, params);
  }

  Trend.id = 'tr-trend';
  Trend.title = 'Trend';
  Trend.fieldType = [
    'number',
    'percentage'
  ];

  Trend.prototype._convert = function(value) {
    // TO BE DONE
  };

  return Trend;
}

require('ui/registry/field_formats').register(TrendProvider);
```

The file will contain a simple provider function, which will create the formatter class.
In our case we name it `TrendProvider`. This function will be registered in the
last line to the field formats registry.

Inside the provider function we'll have to follow these steps:

Inherit the `FieldFormat` class from
`ui/index_patterns/_field_format/FieldFormat` which is done in the first few
lines by using lodash.

After that we have to set some of the properties of the new Trend class, that
will configure our field format:

The `id` is the unique identifiert for that field format which should be as
unique as possible, because Kibana uses it to reference this field format. It
wouldn't hurt to use a prefixed id (with your personal/company's id in it).

The `title` of the field format is the string that will shown to the user when
they want to select the appropriate field format in the settings page of Kibana.

The `fieldType` array contains all field types, for which this formatter works,
i.e. all types for which it will be shown when editing an appropriate field in
the Kibana settings. Valid types in this array are: `number`, `boolean`, `date`,
`ip`, `attachment`, `geo_point`, `geo_shape`, `string`, `murmur3` (Murmur3
plugin hashes), `unknown` (unknown field type).

The actual conversion is done in the `_convert` function of your class and we
will come to it in a bit.

Last but not least your provider has to return the field format class you just
created.

## Formatting values

The actual formatting logic is done in the `_convert` method of your formatter.
The function gets the value of the field as the first parameter. You just have
to return whatever you wish to represent the field with from the function. For
our trend formatter lets use the following function:

```js
Trend.prototype._convert = function(value) {
  return (value > 0) ? value + ' ↑' : value + ' ↓';
};
```

For the sake of convenience we don't check for 0 values here and only add an
up or down arrow behind the value depending whether it's positive or negative.

If your plugin is now loaded correctly you can go to any index settings in
Kibana, edit a number or percentage field and should see your Trend formatter in
the select box of formatters. If you use it for a field the arrow will be
appended to the value wherever a value of this field is shown.

Whatever the function returns will be rendered as plain text, i.e. no HTML
allowed here. But there might be several cases, where you want to render HTML
instead of plain text as a formatter (e.g. an image formatter, using colors in
your output, etc.) To use HTML rendering you can use an object instead of a
functions, which have two keys: `html` and `text`:

```js
Trend.prototype._convert = {
  text: function(value) {
    // Return a textual representation of the value
  },
  html: function(value) {
    // The return value of this function can contain HTML, which will be rendered.
  }
};
```

The text function is exactly the same as if you would have specified a function directly to
`_convert` as shown above. The return value of the html function can contain
HTML markup which will be rendered.

The HTML function will be used whenever Kibana is able to render HTML in the
place it needs to show a value (e.g. the Discover Tab, Visualizations, etc. -
nearly everywhere) and the text function will be used in some places where HTML
wouldn't fit well (e.g. when applying a filter on a dashboard to this value, the
value shown in the filter bar will be rendered as pure text).

For the HTML function Kibana will also pass the field itself as a second
parameter to the function. This can be used, to retrieve some information about
the actual field, you are formatting, e.g. `field.type` to get its actual type
(e.g. if you are supporting multiple field types). But be aware, that this value
(the complete field value) might be `null` or `undefined` in cases where Kibana
can't successfully determine a field type, e.g. when showing values of
aggregation results. This second parameter is not available for the text method.

To see a full example have a look at the
[trend.js](https://github.com/timroes/tr-k4p-fieldformatters/blob/master/public/trend.js#L41)
file on GitHub.

## What's next?

Field formatters can be more complex and e.g. bring their own settings to let
the user customize the formatting. If you want to create a more complex field
formatter I recommend having a look at the
[existing formatters](https://github.com/elastic/kibana/tree/master/src/ui/public/stringify/types)
in Kibana. Several of them contain more complex implementations with settings
(e.g. the Color or the Date formatter).

If you have any questions feel free to leave a comment, contact me otherwise or
use the official Elasticsearch [discussion forum](https://discuss.elastic.co/).
