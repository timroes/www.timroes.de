---
title: Optimizing your webpage — Font Loading
created: 2016-09-25T22:57:00
slug: optimizing-font-loading
authors:
  - timroes
series: 10kapart
category: Web
summary: |
  Building a real-life webpage in just 10k initial loading size is possible and this
  article explains how you get closer to it by loading fonts asynchronous and providing
  a good user experience.
image: /banners/optimize10k.svg
---

[[hintbox]] This article is part of my series on [how to optimize a webpage for 10k size](post:optimizing-for-10k).

The behavior of web font loading in browsers is still [pretty inconsistent](https://developers.google.com/web/updates/2016/02/font-display)
especially once it comes to slow loading. There are plans to introduce
a `font-display` property to let the developer control that behavior, but currently
the browser support for it in 2016 is still [pretty non-existing](http://caniuse.com/#feat=css-font-rendering-controls).

The issue with webfonts is: what does the browser render, while the font is still loading
in the browser? One bad behavior (that some browsers still use) is not showing any visible text
while the font still loads. That means even though HTML and critical CSS is there,
the user won't see anything on the page, because the webfont is still missing.
Also most of the browsers today wait at least 3 seconds, then fall back to a fallback
font, if the font hasn't finished loading and then swap the true font in once it finished
loading. This is also what `font-display: block` in a `@font-face` will do, once support
is there. So I tried to create an improved font loading.

One possible solution (e.g. The Guardian uses it) is to load fonts via AJAX on the
first visit and put them into the Local Storage once they loaded. In any following
visit the font is in Local Storage and will be used, but the first visit will just
fall back to a system font. This is a good solution for e.g. news pages, that have
a high rate of returning visitors. This blog has around 65% new visitors every day,
meaning most of the visitors will never see the webfont I wanted them to see, so
I could basically get rid of it.

So I started using [Font Face Observer](https://github.com/bramstein/fontfaceobserver),
which allows you to load fonts via JavaScript and listening on finished loading events.
In the CSS I just used `font-family: sans-serif` so the user will see a system font
while loading. Then I trigger loading of the webfont via Font Face Observer asynchronous.
Once loading of the font finished, I set set `font-loaded` class on the body, which
triggers the CSS rule, that has the correct font-face set, i.e. `font-family: Roboto` in my
case. This behavior, where you show a fallback font and swap it once the webfont is loaded
(no matter how long it needed), can be achieved with `font-display: swap`.

This method had two issues for me. If a font is already in cache (e.g. with Service Worker or
regular browser cache), you could see the fallback font very shortly before it is replaced
with the webfont from cache. This caused an ugly flickering of text on all pages, once
you have the font in cache. The second problem was, that I didn't want fonts to swap
in anymore, if they need too long to load. In that case the user might already be
in the middle of the article, the font will be swapped in, which causes the browser
to render with the new font and all content will jump, due to new font metrics.
As I explained in [the main article of this series](post:optimizing-for-10k) I consider
jumping content as one of the main sins in web design.

I first got rid of the second problem. Once the font face finishes loading, I only
swap in this font, if the `DOMContentLoaded` has happened in the last 2 seconds.
If the font needed longer to load, I just ignore it for this page view, though the
loading stil has caused the font to be cached by the browser now. That way I prevent
jumping content, on slow connections where the font might take some seconds to load
and don't interrupt the users interaction flow anymore.

To prevent the flickering on every page, once the font is in cache, I set a class
on the body with an inline script tag directly during HTML parsing, which will
set `display: none` to the body. This class will be removed once the font is loaded,
but no later than 400ms after loading it. If the font is now cached it will load most
likely in under 400ms and the body will directly show with the correct font without
flickering. You will only see a font-face swap if the font loads longer than 400ms
but within 2 seconds. This behaviour is also what `font-display: fallback` will
do, except that it won't hide the complete body, but just renders the text invisible
before switching to the fallback font.

I played around a lot with the values and figured out, I find the loading behavior
the most pleasant with 400ms and 2s thresholds. The
[font-display proposal](http://tabatkins.github.io/specs/css-font-display/#font-swap-period)
suggests values of 100ms before showing the fallback font and swapping times up to 3 seconds,
but they also use a different way to measure these times, then I do.

To see the code, you can check the [fontLoading.js](https://github.com/timroes/www.timroes.de/blob/master/src/scripts/fontLoading.js)
of my blog, which triggers the loading and swapping, the script tag in
[index.hbs](https://github.com/timroes/www.timroes.de/blob/master/src/index.hbs#L34)
which hides the content to prevent the flickering text, usually called *flash of unstyled text* (FOUT).

The `font-display` proposal suggests two more values: `auto` should let the user-agent
decide, what method it wants to use for font loading. `optional` should use the font if
it loads very fast (e.g. because it is loaded from cache) or use the fallback font
after that short limit and never swap in the loaded font.
