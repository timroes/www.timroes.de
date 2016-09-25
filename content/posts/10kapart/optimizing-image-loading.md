---
title: Optimizing your webpage — Image Loading
created: 2016-09-25T15:42:00
slug: optimizing-image-loading
authors:
  - timroes
series: 10kapart
category: Web
summary: |
  Building a real-life webpage in just 10k initial loading size is possible and this
  article explains how you can improve image loading to get closer to it.
image: /banners/optimize10k.svg
---

[[hintbox]] This article is part of my series on [how to optimize a webpage for 10k size](post:optimizing-for-10k).

Loading images async is done pretty easy and pretty easy done wrong.

To load all images on this blog async, I just renamed the `src` and `srcset` attributes to `data-src`
and `data-srcset` and add a class `ll` (lazy-loading) to it. In JavaScript
I just search for all elements with the `ll` class, rename the attributes
back to `src` and `srcset`, which will trigger the browser to load the images, and
remove the `ll` class. You can view the script on [GitHub](https://github.com/timroes/www.timroes.de/blob/master/src/scripts/lazyload.js).

Inserting this in a page that has several images in the text, you have just created
the worst user experience possible - *jumping content*. See [this post](post:optimizing-for-10k)
to read why jumping content is such a bad usabilty. In short: you interrupt the
user's interaction flow with your page.

Before the images have been started loading there is just an 0 height img tag in the
page. As soon as the browser has loaded the first bytes of the image, that contain
the dimensions of the image, it will resize the img tag to this dimensions, giving
it a new height. That way all the content below the img tag suddenly jumps.

To be honest: that behaviour will also happen with regular `img` tags without lazy
loading before the browser has these first bytes. But since the browser immediately
start loading the image while parsing HTML, you will require a very slow connection
to witness that behaviour. With async loaded images it is very likely you will see
the juming content also on fast connections.

To get rid of this jumping content (also for regular loaded imgs) you need to know
the size of the image on the server when building the HTML. You could than set the
width and height of this image to the `img` element (or a wrapper around it) so that
the element already has the correct dimensions before the information from the actual
image is there, e.g. instead of placing a `<img src='foo.png'>` into your HTML
you would use `<img src='foo.png' width="300" height="200">`.

That solution unfortunately doesn't work well if you have something like
`max-width: 100%` in your CSS for small screens. In that case the image would
still have the full height on small screens, because the height value doesn't scale down
when the width scales down, due to the max-width limit. You would need to set
something like: `max-width: 100%; height: 1.6*width` where 1.6 is the aspect ratio
of the image to get the correct height no matter what the actual width will be.

Unfortunately there is no possiblity in today's CSS to set this easily. Luckily there is
a CSS workaround. The padding values of an element are - when specified in percentage - in
percents of the width of the element. I use this on my blog to create a container
around every image, that looks as follows:

```html
<div class="image-wrapper">
  <div class="image-placeholder" style="padding-bottom: 62%">
  <img src="foo.png">
</div>
```

With 62% being is the aspect ratio of the image (height / width * 100). I use a build
system to generate static HTML output of that form, but you could also generate it on the
fly with PHP, Node or something else. You can find the HTML generation for images
in the [Renderer.js](https://github.com/timroes/www.timroes.de/blob/master/gulp/rendering/Renderer.js#L159)
of my blog.

The image-placeholder element now have the correct
height in relation to the width of the image-wrapper. It will prevent any jumping content,
since you now have the correct height as soon as the HTML loaded, before any byte of the actual
image is transfered. To position the img and image-placeholder above each other, just position
the img `absolute` and give the `image-wrapper` class a `position: relative`.

You can also use the `image-wrapper` element to add some placeholders before the image
is loaded, e.g. via an inline SVG in the background of that class. This CSS should
be included in the above-the-fold CSS to make sure the placeholder is visible from
the beginning. You can check the [CSS](https://github.com/timroes/www.timroes.de/blob/721b486d8d2cbc6a6a1530d7fc8b4b7d5c8f689e/src/styles/atf/_content.less#L96)
for my images on GitHub.
