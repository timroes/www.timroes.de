---
title: Writing Kibana 4 Plugins – Basics
created: 2015-12-02T12:00:00
authors:
  - timroes
slug: writing-kibana-4-plugins-basics
image: /banners/kibana-plugin-banner.png
series: kibana-plugins
category: Kibana
summary: |
  This tutorial series explains how to create own Kibana plugins. This first part
  explains the basics.
---

From Kibana 4.2.0 upwards custom plugins (of different types) can be written for
Kibana and made available for all Kibana users. This tutorial series will guide
you through the process of writing your first plugin and show you some of the
possibilities plugins offer, e.g. adding custom visualizations, writing new
"Apps" (from 4.2.0 on, Kibana itself as you know and love it is just an App
inside the framework), or adding new tabs to the inspection pane of a
visualization.

[[hintbox]] **Huge warning: **Kibana offers an interface on how to install plugins
from 4.2.0. It does not offer public API to develop against. Nevertheless they
kind of advertise writing plugins, so I decided to publish this tutorial. Since
there is no separation between private and public API, your plugin might break
with the next patch version update, since they might change the services you
have been using. So keep in mind, if you want to develop plugins you develop a
plugin for a very specific Kibana Version and you have to test your plugin with
EVERY Kibana version. The full discussion about the topic of a public API can be
found in this [GitHub issue](https://github.com/elastic/kibana/issues/4704).
This tutorial has also been written for (and tested against) Kibana 4.3.0 and I
most likely won't change and retest the tutorial for every new Kibana version.
But please feel free to comment any changes you have found in the comment
section!

This tutorial (and writing Kibana plugins in general) requires, that you are
experienced in web development. The following skills are prerequisites and won't
be explained in this tutorial:

* JavaScript development (npm modules;  ..)
* AngularJS
* RequireJS

This first part of the tutorial series covers the basics on how to setup the
build system to develop your plugins and the basic structure of any type of
plugin. You should read this part before jumping to any of the other parts that
look into different types of plugins.

## Setup build system

**Update**: The guys behind Kibana have a video on how to setup the build system
on YouTube: [The Contributor's Guide to the Kibana Galaxy](https://www.youtube.com/watch?v=FZEKhPz7SPQ)

Before you start developing you will need the usual web development setup, i.e.
install [NodeJS](https://nodejs.org/) and npm.

**1. Download Kibana** To develop plugins you will require a local Kibana instance for development. Since
we need the plugin reloading feature, which is not available in the production
code, you will need to download the source code for the Kibana version you would
like to develop the plugin for. Either checkout the tag via git or select the
appropriate tag on GitHub and download the source code as a zip file from
<https://github.com/elastic/kibana>. During this tutorial we will use Kibana
4.3.0.

**2. Install dependencies in Kibana** Once you downloaded the Kibana
sources, you need to execute `npm install` in the sources to install all
required dependencies.

**3. Start up an appropriate Elasticsearch** Besides a
running Kibana you will also need an Elasticsearch instance to which the Kibana
should connect. One option is to use any running Elasticsearch instance (to
which you can configre the URL in the `config/kibana.yml` file). Another option
is to start an Elasticsearch instance from the Kibana development environment.
This has the advantage, that Kibana knows exactly what Elasticsearch version
it's requiring and will start an appropriate version. To start up that
Elasticsearch instance, type the following inside the Kibana folder:

```-
> npm run elasticsearch
```

It might take some time, to download the appropriate version and start it up.
Once it's finished you will see a table with the port and cluster name.

**4. Start up Kibana** Once this is finished, you can start up kibana by executing
the following command in your Kibana source code folder:

```-
> npm start
```

This will start Kibana in development mode, which means it will automatically
reload all the plugins if you make changes to them. The startup might take
several minutes and is finished once you see some messages about "Lazy
optimization success".

You should place the source code of your plugin in the _installedPlugins_
folder. Kibana will automatically watch this folder for changes. **Attention**:
it's not enough to symlink your plugin folder into this folder, due to some
dependency resolution issues. Your plugin source code must actually be placed in
that folder.

To create a new plugin create a new folder in the _installedPlugins_ folder. The
name of the folder must be the name of your plugin, which will be covered in the
following chapter.

Every time you change a file in your plugin now, Kibana will kind of repackage
and optimize sources. This might take some time (around 10 seconds for the
simple sample plugins I created for this tutorial). You will see this on the
console where you started Kibana with messages like the following:

```-
restarting server due to changes in
 - "installedPlugins/tr-k4p-clock/index.js"
server log [21:49:59.323] [info][status][plugin:tr-k4p-clock] Status changed from uninitialized to green - Ready
[...]
server log [21:49:59.421] [info][listening] Server running at http://0.0.0.0:5601
optmzr log [21:50:07.177] [info][optimize] Lazy optimization started
optmzr log [21:50:13.834] [info][optimize] Lazy optimization success in 6.66 seconds
```

The changes has applied as soon as the lazy optimization succeeded. Once this
succeeded you can refresh your browser to see your changes. Sometimes Kibana
isn't able to properly reload the changes. In that case just kill it and restart
it again (which might again take a minute or two) and see if that fixes your
problems.

## Plugin Basics

Every plugin is a npm module. So it needs at least two files.

You need to place a `package.json` into the root folder of your plugin. It is
the regular [npm package](https://docs.npmjs.com/files/package.json) file. You
need to specify the plugin name at least, but it would be useful to also specify
a version. The package file might look something like the following for our
first plugin:

```js
{
  "name": "tr-k4p-myplugin",
  "version": "0.1.0"
}
```

The _name_ from the `package.json` must be equal to the name of the folder your
plugin lies in. (Actually this is not completely true, but you might get
confused later on when to use the folder name and when the pacakage name if they
are not the same. Also installing published plugins which do not follow these
rules, might get complicated and confusing. So I highly recommend using the same
for package name and folder name!)

The second file that is mandatory is the main module file which must be named
`index.js` unless you specify something else in your package.json. It is the npm
module and setups everything your plugin needs. You get a reference to a kibana
object passed to your module. Your module must instantiate a new instance of a
kibana plugin as follows:

```js
module.exports = function(kibana) {
  return new kibana.Plugin({
    // Your plugin configuration
  });
};
```

These two files make up the most simple plugin, Kibana can load and it does -
surprisingly - nothing so far. In the following parts of the tutorial we'll look
at all the code you can insert into index.js (and more files) to fill your
plugin with life.

Besides those two files most plugins will have a folder named public in their
root directory. All files that won't run server-side but will be transferred to
the client browser go inside this folder.

### Package/Plugin Name

The package ID/name that you chose should be globally unique. It will be used by
Kibana to resolve files inside your plugin and should not collide with any other
plugin. That’s why I recommend prefixing it with some custom string, that
identifies you/your organization. E.g. I use tr-k4p (for Tim Roes, Kibana 4
Plugin) as a prefix in most parts of this tutorial series.

## Yeoman Generator

There is a yeoman generator for helping you bootstrap a Kibana plugin. You can
find it in the npm package
[generator-kibana-plugin](https://www.npmjs.com/package/generator-kibana-plugin).
It’s highly recommended to actually use this generator. We will just *not* use it
during this first parts, since it’s creating a lot of sample code and we will
anyway look at all required files in detail. But after the tutorial you should
use the generator.

To get instructions on how to use the generator, see it’s [npm page](https://www.npmjs.com/package/generator-kibana-plugin).

Since the most recent versions, using the generator also will create build
tasks, that automatically start your Kibana instance. So if you use the
generator skip step 4 above and don’t start your own Kibana.

## How to publish and install plugins

Even though your plugin doesn’t do anything yet, it has the minimal code to be
loaded into Kibana.

During development you don’t need to install your plugin, since we are working
in the `installedPlugins` directory. But once you finished your plugin, you might
want to install it to some real Kibana instances.

To publish your plugin, you basically need to zip the content of your directory.

[[hintbox]] **Hint about node_modules**: If you require runtime dependencies from your
`package.json` you will need to bundle these dependencies (i.e. the appropriate
node_modules subfolders) into the zip. If you use the generator as mentioned
above, you can just execute `npm run build` to create a bundled zip file.

You have to make this zip available somewhere and install it in your Kibana
instance as follows:

```-
bin/kibana plugin --install plugin-name -u https://url.to/plugin
```

You can also specify URLs with the file schema to install from a local folder.

More documentation on installing plugin can be found in the [Kibana
Plugin](https://www.elastic.co/guide/en/kibana/master/kibana-plugins.html)
documentation.

## Different plugin types

Plugins can extend Kibana in several ways. One plugin can connect to one or
multiple of the extension points to offer new functionality. The most common
extension points are most likely:

* **visTypes** – add new visualization types to Kibana.
* **apps** – Kibana has the possibility to add completely separated apps, that can offer new
  functionality. One famous example might be [timelion](https://www.elastic.co/blog/timelion-timeline),
  a time series composer for Kibana, which is an app inside of Kibana.
* **fieldFormats** – Add new field formatters to Kibana
* and several others

This tutorial series will mainly focus on adding new visualizations to Kibana.
If you want to create plugins for other extensions points, I would recommend
looking into the sources of some other plugins (there are also some in the core
of Kibana), that are similar to what you would like to do.

## What’s next?

In the following parts we'll show different type of plugins and create a bit
more meaningful plugins. For everything you see in the following chapters you’ll
need to create the above mentioned package.json and load as described. This
won’t be mentioned again in any chapter. Ready to write your first simple
visualization? Jump to [part two](post:plugins-02-visualizations) of this tutorial series. If you are interested
in other types of plugins look at the *related posts box* at the top of this page.
