---
title: 'The Future of Kibana – An Opinion'
image: /banners/kibanaX.svg
created: 2017-06-29T20:00:00
authors:
  - timroes
slug: the-future-of-kibana
summary: |
  This post shows my point of view about the future of Kibana.
category: Kibana
---

Kibana has come a long way since I started using it (with early Kibana 3 versions)
and definitely a long way since the very beginning. Looking at the most recent versions
development speed seems to have increased many times over and every version brings
new amazing features. In this post I want to share my opinion about the current
state of Kibana and where that journey might lead to in the future.

In the past year(s) Kibana has introduced a wide variety of features. Besides the
well-known discovery of data, basic visualization of it and building dashboards,
Kibana nowadays also include rhich possibilities for time series analyzation via
[Timelion](https://www.elastic.co/guide/en/kibana/current/timelion.html) or the
still experimental [Time Series Visual Builder](https://www.elastic.co/guide/en/kibana/current/time-series-visual-builder.html).

Kibana now offers with [Graph](https://www.elastic.co/de/products/x-pack/graph) a
visualization and analyzing tool for relations in your data. Capabilities to
manage and monitor your Elasticsearch cluters has been enriched by several new UIs.
Also, new visualizations have been added (like [Tag clouds](https://www.elastic.co/guide/en/kibana/current/tagcloud-chart.html)
and [Heatmap charts](https://www.elastic.co/guide/en/kibana/current/heatmap-chart.html)).
And these are just some of the new features added to Kibana over the past years.

Some of the changes currently happening have my special attention and I want
to highlight them in particular.

UI Design
---------

Using Kibana myself a lot and also explaining it to other people (which is likely
the reason you came to my blog in the first place) I got the feeling that Kibana
was built from techies for techies. I felt, that explaining Kibana gets more and
more difficult the less tech-savvy your audience is. But why? Kibana isn't
a developer tool, it's a data tool, so it should be easy to use for people, that
are "into data", but not necessarily into tech.

I think one of the main reasons for this is the lack of a proper UI/usability
team from the very beginning. But that's one of the things that has been changed
over the last two years. Elastic has hired several UI designers, usability engineers,
etc. in that time. Seeing how the UI changed in that time, shows me, that these
people are doing a great job and I feel Kibana will get easier and easier to use
for *everyone* in the future and not just tech-savvy people.

Canvas
------

One of the most interesting news for me on the *elastic{ON} 2017* was the presentation
of *Canvas*, a new way to present visualizations. You could describe it as the mix
of Kibana dashboards with an online office solution. You design (beautiful) reports
by placing visualizations that pull their data straight from Elasticseach onto
slides. The following screenshot shows an example shown at *elastic{ON}* how this
could look like:

![A screenshot of the new Canvas tool in Kibana showing a visual appealing slide of graphs](/kibana-canvas1.png)

What's so great about that, you might ask. Isn't it just dashboards with a
more beautiful UI? Yes and no. If you have a close look at the above screenshot,
you can spot some control elements, like a *String Input* or a *Number Slider*.

Meaning *Canvas* not only gives you the possibility to build static (but beautiful) dashboards,
but it also offers you the possibility to create "dashboards with logic and controls"
or you could say *apps*. Rashid Khan showed the following demonstration during
*elastic{ON}* in which you can find a select box for filtering and a text input
box to enter a query.

![A simple app inside Canvas with some controls](/kibana-canvas2.png)

I've seen several companies, where visualizations and dashboards are built by one
department and used by a completely different one. DevOps teams may build
monitoring dashboards, that are also used inside the first or second level support
teams, data analysts build visualizations for a marketing department analyzing the reach
of their newsletter, and many many other use cases.

In many of those use cases, a possibility to build logic into the dashboards, without requiring
the user to understand all the inner workings of Kibana/Elasticsearch (e.g. the query
language or what aggregations are), would be a huge improvement, since you don't need
to give the "user" of the dashboard all the possibilities that the creator had.

There is also a feature in Kibana to lock editing of dashboards, since the need
for that was addressed multiple times. But maybe the marketing department using
Kibana to visualize the reach of their newsletter, want to have an option to select
which newsletter to visualize. Maybe the first level support wants an option
to jump from the visualization of all monitoring data to the one of a specific
branch/store/server/etc. Canvas might be exactly the tool that could help in such
use cases, to build exactly what is needed for the user, without giving them too much
or too less customization possibilities.

Besides its usefulness, this might even be a complete new sales field inside (or outside) of Elastic.
A field similar to customizing in large ERP systems. Specialists are customizing and
scripting apps for clients, so that these can just use the
apps that are exactly fitted to their needs. Currently this will require writing
plugins for Kibana or modifying the sources directly, which isn't an easy (and
more important - stable) task. Thinking about the customizations and custom web frontends
I built or have seen built in the past upon Kibana (or Elasticsearch directly): I can't
think of a single one, that wouldn't have been possible in Canvas - at least if it would provide
some limited scripting capabilities.

Sharing Canvas apps and web reports that updates themself, would have been a benefit
for a lot of users and use cases I've experienced in the past. Thus I think Canvas
might become one of the core parts in future Kibana versions and maybe the only
part that a vast majority of future Kibana users might ever see.

Using web development techniques like progressive web apps, those customized apps
might even serve as mobile view into your data.

Looking at the fast pace of change in Kibana and all the new features, that came
in the past and that are still in development, I am sure Kibana will stay and
maybe even grow more important in the Elastic stack.
