---
title: Optimizing your webpage for 10k
created: 2016-09-25T15:00:00
slug: optimizing-your-webpage-for-10k
authors:
  - timroes
series: 10kapart
category: Web
summary: |
  Building a real-life webpage in just 10k initial loading size is possible and this
  article explains how.
image: /banners/optimize10k.svg
---

With [10k Apart](https://a-k-apart.com/), Microsoft created a wonderful challenge for
web developers to optimize web projects as much as they can. The challenge is to create
a working web application in an initial file size under 10 kB.

Instead of creating a new small project for this contest, I decided to optimize
my blog to met the requirements. Why? If I would have created a new project I would
have skipped several real world issues just for the sake of the contest.
For example, I would most likely not have included share headers (Open Graph, Twitter, etc.)
into the HTML of the page. But those things exist and are needed in "the real web" and
optimization doesn't mean to get rid of everything, that is not needed for
a contest, but to make the _real web_ as amazing as possible.

Since knowledge is worth twice once you share it, I will use this article to explain what I
did, what I learned during optimizations, and besides it will be my contest entry.

The target
----------

What is the better webpage: the one that loads in one second or the one that loads
in five seconds? The answer is: it depends. If the five second webpage offers the user
a fully usable webpage after 200ms and just loads nice-to-have features afterwards,
while the one second webpage waits a complete one second before it offers anything
to the user, the user benefits way more from the first experience.

You want the user not to wait long. That doesn't mean, that you must have loaded
everything in - let's say - under a second. It just means: keep the waiting time, i.e.
the time the user can't do anything useful with your page, as short as possible.

That's also why the 10k Apart contest is about an initially loading
size below 10k. You should offer an interactive result for the user in 10k and
load asynchronous what you don't need for that.

Where did I start from?
-----------------------

To see where I start from, I looked at the file sizes of several pages of my blog
and e.g. the start page had the following sizes:

| Type       | Size   |
|------------|--------|
| HTML       | 3.5kB  |
| CSS        | 7.2kB  |
| Images     | 96.8kB |
| JavaScript | 39.6kB |
| Fonts      | 62.8kB |

Those summed up to a total of around 210kB for the start page. So a long way down
to 10kB. So what could one do to decrease that size?

* Optimize JavaScript loading
* Load fonts asynchronously
* Load images asynchronously
* Use above-the-fold rendering for CSS
* Make the HTML smaller

[[hintbox]] If you haven't minimized your CSS, JavaScript, HTML, images yet, that it of course
the very first step to do. There are great tools out there like [imagemin](https://github.com/imagemin/imagemin),
[UglifyJS](https://github.com/mishoo/UglifyJS) and [clean-css](https://github.com/jakubpawlowicz/clean-css)
that you can easily integrate into your build process. The sizes above are of course
the minified and gzipped - which you should totally use on any webserver - sizes.

The main restriction I set myself was, not to decrease the user experience I already had.
Also though the main target of the 10k Apart contest is the 10kB file size, the idea
behind this is to create amazing web experiences. It wouldn't match the idea
of the contest to get files smaller by decreasing user experience.

Besides the size limit the contest also judges aspects like accessibility,
interoperability, progressive enhancement, design and user experience, which I
will also cover throughout this article.

Optimizing JavaScript
---------------------

Let's first look at how I optimized the JavaScript. In fact most of the optimizations
explained during this section were already made when I created the new blog software
or some month after. But for the sake of this article, let's assume they are all new :-)

One of the technologies you should definitly have a look into when it comes to performance
are Service Workers. Serice Workers allow a browser the cache a complete webpage
for offline usage and serve it completely from cache. There are tons of great articles
out there in the web on how to use them, so I won't cover it in this article in detail.

I use [sw-toolbox](https://github.com/GoogleChrome/sw-toolbox) to create a service
worker that caches all articles on your first visit of the blog and all required
resources, except images, since they are just too large and in most of my articles,
they aren't really an important part of the article. Though if you visit an article
while being online, all images loaded will still be added to the cache for later
offline usage.

The easiest part I could do, to optimize the JavaScript loading performance, was
adding the `async` attributes to the script tag, that loads the JavaScript. The
[browser support](http://caniuse.com/#feat=script-async) is pretty good and the browser
will now load the script asynchronously and execute it once it's finished loading.

That technique is especially usefull if JavaScript is completely optional, as it
is for this blog (the so called _progressive enhancement_). The blog just adds some
nice-to-have features with JavaScript, like:
you get a sticky footer on bottom of the screen, without JS this footer will just be
at the bottom of the article. If you have a smaller device and JS, the related posts
below some articles will be collapsed by default and can be expanded. Without JS they
are just expanded all the time. The history of a post is loaded via AJAX and so only viewable with JavaScript,
since I don't consider this an important feature for the main purpose of this blog. Also buttons
to copy code snippets in the articles are considered optional by me and only available
via JavaScript.

In general I would recommend, if you can live without JavaScript, do so. As seen above
there are features that you might just not want to have without JavaScript and some
that you might want to build another way or with another design. But if you can't?

This brings me to the first and for me most important rule in optimization:
**Get your priorities straight!**

[[hintbox]] Only [1.1% of users](https://gds.blog.gov.uk/2013/10/21/how-many-people-are-missing-out-on-javascript-enhancement/)
are not experiencing your webpage with JavaScript. Also note, that the statistic
is from 2013 and I expect this number to be even smaller today, but haven't found
any more up-to-date numbers. If you compare this number e.g. to the number of
[blind users](https://nfb.org/blindness-statistics), which is around 2 to 3 times higher,
and you haven't optimized for both groups, you might want to start with the latter group (also
taking into account, that disabled JavaScript is more often by choice than being blind).

Besides using `async` to get the JS I thought about getting rid of jQuery completely, which would
decrease the size of the loaded script a lot. In the end I decided against it, since
jQuery does a great job in solving all the interoperability issues between different
browsers.

So I ended up in having around 40kB JavaScript loaded asynchronous and not being
required at all. If the request e.g. would fail or the user doesn't have JS
available only small enhancements would be missing.

Above-the-fold CSS
------------------

Next up was the CSS. I earlier loaded 7.2kB in the head of my page. That's too much
and I wanted to get it down and even more important split it up and use
[above-the-fold](https://css-tricks.com/authoring-critical-fold-css/) CSS.

In that way you determine some "critical" CSS, that you don't want your page to render
without and load the rest async. The critical CSS is often the CSS you need to render
what is visible "above-the-fold", i.e. without scrolling your page. There are some
tools that automate that process and figure out which CSS you need without scrolling.

I would recommend splitting up manually. There are parts of your CSS above the fold
that you still won't consider critical and stuff out of view, that you still might to load.
But how to decide? This brings me to my most important rule: **Prevent jumping content!**

Jumping content means your page shows content and while more and more async loaded
resources come back the content starts too jump, e.g. because images are inserted,
sizes set in CSS changes, etc. Why is jumping content so bad? Your user has already started interacting with the
page and perhaps is trying to click a link in that moment content jumps and suddenly
the link is somewhere completely different. Even if the user
isn't clicking there is usually at least the human-machine-interaction of reading the page, which
jumping content will just interrupt. So how does this influence splitting?

Some of the stuff I would recommend putting into critical CSS:

* General positioning (dimensions, margins, paddings, etc.) of elements
* Font families and sizes, line-heights, several other font-metrics

Some recommendations of what to load async:

* Colors (e.g. color scheme for syntax highlighting in this blog)
* CSS for elements clearly out of scroll (e.g. the author box below this article)

To prevent that elements that I didn't put any styling in the critical CSS (author box, comments, footer, etc.)
from showing in an unstyled version for the case the async loaded CSS needs longer to load than
the user to scroll to them, I used `display: none` in the critical CSS to hide
them until their final style has been loaded. If you need more inspiration on
how to split up your CSS, you can have a look at [my styles](https://github.com/timroes/www.timroes.de/tree/master/src/styles)
with all critical styles in the "atf" folder.

I ended up with 2950 bytes critical CSS loaded synchronous with the article and even
splitted up the async loaded CSS a bit more. I recognized that 2kB of the remaining
CSS are only used for the start page, which the vast majority of the visitors
never visit. So I extracted this into its own file and only load it on the start page.
The remaining 2775 bytes of CSS are loaded via [loadCSS](https://github.com/filamentgroup/loadCSS#recommended-usage-pattern).

Several people (and Google PageSpeed Insights) recommend inlining the critical CSS
into the head of your page, to prevent any further network request and also not having
possible failed requests. I considered 2.9kB still too large to inline into the HTML
and prefered that being also cached between pages and not needing to be transfered for
every article you read again. I prefered making sure the blog looks also readable
for the case that request fails and you don't have any CSS.

Load fonts asynchronously
-------------------------

Webfonts can make up large parts of the total size of a webpage. So it is also useful
to load them async. Since browser behaviour isn't very consistent in font loading yet
and I wanted to give the best experience and not having text that shortly flashes
after loading, I build some custom font loading into the blog. Since the explanation
is a bit longer, I spend font loading its own post: [Optimizing your webpage - Font Loading](post:optimizing-font-loading)

As a result of this optimization all fonts are now loaded asynchronous and so we got
rid of another 70kB before user meaningful user interaction.


Load images asynchronously
--------------------------

Besides finding and fixing a bug in my build system, that caused my favicons to become
larger while optimizing, I also started loading all images - except the 601 bytes favicon
on top of the page - async.

Since async image loading deserves some more attention, I wrote a complete
article about it: [Optimizing your webpage - Image Loading](post:optimizing-image-loading)

After optimization I ended up with all images being loaded async and not contributing
to the 10k initial loading size at all anymore.

Design and Accessibility
------------------------

Good design is as important for visual unimpaired users, as good accessibility (a11y) for
visual impaired users. I didn't change the design during this contest, since I tried
creating a proper design when I created the blog. The most important part for me about
the design was: focusing on the content. I didn't want to get any big headers or
side navigations distracting the reading flow of the user. I tweaked font metrics
a lot until I (and the people that tested for me) found them the most pleasant to read.

Unfortunately I haven't spend much time into tweaking accessibility of my blog, but
thanks to 10k Apart I did now.

I used tools like [a11y](https://github.com/addyosmani/a11y) to check for issues
in the blog. I highly recommend using such tools - and use common sense than. These
tools are great in showing you several issues that are really existing, but you
also need some common sense to filter out several false positives.

First I checked, that the [OpenDyslexic](https://opendyslexic.org/download/) plugins
work fine with my page, so dyslexic people can read this blog properly.

Next I corrected the contrast of of all my colors to have at least the
[WCAG recommended](https://www.w3.org/TR/WCAG/#visual-audio-contrast) contrast ratio of **4.5:1**.
Therefore I shifted some of the colors a bit to make them slightly lighter or darker.
This [contrast ratio calculator](http://leaverou.github.io/contrast-ratio/) helped
me a lot while finding new colors. If you have some corporate identity, that you must
respect, these kind of tasks might be a bit more complicated. So shoutout to all
designers of corporated identities: take these recommendation already in mind when
creating color palettes.

The hardest part was testing for screenreaders. I am working on Linux whose screen-reader
choice (and real-world distribution) is quite low. The best screen reader for testing
I found was [ChromeVox](http://www.chromevox.com/), Google's screenreader used in Chrome OS.
You can install it as a simple Chrome plugin and start optimizing your page. I later checked
everything on a Mac with VoiceOver again and made sure it also works as expected.

One of the large problems there is, screenreaders are adding a third level to the
compatibility matrix, that browsers and operating systems are already creating.
VoiceOver may behave different with Safari on Mac than with Chrome on Mac, which
might differ from Chrome on Windows with Jaws, etc. Unfortunately documentation
on what tags and what behaviour is implemented in which screenreader is pretty
non-existing (except some rare pages where you find some of the combinations tested
for one special ARIA tag or so).

So what are my recommendations for a11y HTML?

* Use standard HTML where possible. If you use `a` for links and `button` elements
  for buttons screenreaders can do their job already pretty good. If you use custom
  elements or use elements in ways not intended, make sure to set the correct
  [roles](https://www.w3.org/TR/wai-aria/roles).
* If you use semantic tags like `nav`, `main` or `header`, screenreaders can use
  these as "landmarks" to quickly let the user navigate towards them and e.g. skip
  directly to main content.
* Set `aria-hidden="true"` on pure design elements not contributing to content, e.g.
  I recognized that screenreaders are reading out the "middle dot" separator between
  my navigation links. So I put it into an aria-hidden span. Another example: the sticky
  footer is a copy, that will be attached to the body. So there are actually two times
  the same element in the DOM (the fixed one on bottom of the article and the sticky one).
  I changed the JS to add `aria-hidden="true"` to the copy, so screenreaders can't see it.
* Some "not just for design images" may be also hidden, e.g. I `aria-hidden`'ed the author images
  on the bottom of the post. Any alternative text would just be "Profile picture of Tim Roes" or
  "a strange guy looking to the upper left". There is no real use in my opinion in
  presenting that to screen readers. The author section fulfills its purpose also
  very fine without the image, so I decided not to put any nonsense alternative text
  on it.
* Create useful `aria-label` or `title` for image links, e.g. the I set a `title` "Share on Twitter"
  on the appropriate share button and therefore `aria-hidden` the "Share on" label
  before the icons (that you will only see if your screen is wide enough). It just sounded
  nicer to have the screenreader read out "link, Share on Google+", "link, Share on Twitter", etc.
  instead of "Share on", "link, Google+", "link, Twitter".
* In some places it makes more sense creating a `aria-label` for a group than "naming" all children (e.g. icons).
  I could e.g. just add a SVG `title` to the clock icon on top indicated the reading time
  of this post. I found the reading flow way better, just hiding the icon to screenreaders
  and give the whole time tag an `aria-label` of "Estimated reading time is 20 minutes". That way
  it's just one "*tab*" (navigation to next item) for that very expressive label instead of: *tab*, *clock icon*
  (or better *reading time*), *tab*, *20 min read*. I did the same for the article overview on the
  start page. Instead of letting the user navigate over 3 children in each link, just add an
  `aria-label` with *post title, written on May 4, 2016, a 12 minutes read*.
* Use advance attributes (like `aria-expanded`) for more advance controls. I have a "Show changes"
  button on top, which toggles the history of changes of a post. I use `aria-expanded` and `controls`
  to mark which element this button toggles and what the current state is. I still find it hard
  to get the screenreader to show the relation to what the button toggles, so I added a label
  "Toggle post changes. Next in tab order when shown." to the button, so you know immediately
  where you can expect the expanded element.

Make HTML smaller
-----------------

After I optimized the above aspects, the last tasks was optimizing HTML. Everything was
already minimzed there, so I thought about looking into minifying CSS class names.
Since I didn't found any plugin that is working well enough and the size benefit
was very minimal, I decided to leave CSS names as they are. I removed some script
tags from the HTML and put them into the async loaded JavaScript and removed some
unnecessary meta tags.

After that I checked sizes and realized, that most of my blog posts are now under 10kB,
but still there are some that didn't match that criteria. So what to do about those?

The HTML for some of the posts is too large, because the content is just too long
to fit in 10kB no matter how much optimization you do on the HTML. So it's nothing
I could solve with plain optimization of the HTML as it was and the only solution
would be splitting up the HTML.

So here is the solution:

* Split up the HTML into page one, two, and so on.
* If the user has JS enabled, load all further pages via AJAX and append to the content loaded initially.
* If the user doesn't have JS, just offer links, which will go to the next/previous page.

That way you can end up with all posts - no matter how long they are - being less than 10kB in size.
Nevertheless I didn't put this solution into my blog. Why? It has some technical and more
important several usability problems.

The main technical issue is searchin engine indexing. If I implement the solution
above, Google would start indexing the first page and since they execute JavaScript index
the whole article as one page (which is also what I would like). Unfortunately a lot
of search engines doesn't execute JS yet and would index all pages individually, which
is not what I would like, since the article should be seen as one article. I could
influence the indexing a bit by setting the canonical URL of each page to the first page,
but than all other pages wouldn't be indexed and seachable. I could create a special
one page serverside rendered version, that is only delivered to search engines.
Right now this blog is completely served static without any serverside logic and I would
like to leave it that way (for performance and complexity reasons).

Way more than the search engine problems ways the usability problem I see. If a user
is on a bad connection, the user might get the initial page one but even with JS
enabled will not be able to load any additional pages, due to connectivity problems.
I tested how the bahviour feels in practise. I prefered waiting for 15kB (my largest
article so far) over reading half of that article, and being stuck with a "Content loading"
spinner when reaching the end of the initial loaded article. That's why I ended
up not implementing this solution, which brings me to the last hint:

**Don't optimize for some arbitrary limits.**

The 10kB are some arbitrary limit and could have been as well 8kB or 17kB (in which case
all my articles would have met the criteria). Do whatever you can to get the best result
for your webpage, but don't set yourself a limit and enforce it by decreasing your
usability or making nonsense decisions.

Since this is one of the articles, having a larger than 10k HTML, I will be hypocritical
enough to split it up into two pages just for the sake of the contest (but leave the complete one page
version on my blog).

The Result
----------

Looking at the new sizes after I finished all optimizations, I am now loading only
2.88 kB CSS instead of 7.2 kB blocking. I am also loading all JS (getting rid of 39.6 kB),
images and all fonts async. That way I decreased my initial loading size from
210kB to 3.46 kB plus the size for the HTML (in case of the start page 3.5kB).

Looking at all different article HTML sizes, I succeeded in having 24 post and pages
to load in under 10k and a remaning 9 to at least load in under 20k.

Also looking at how the page loads the loading behavior has improved, especially
for low connections, and the - in my opinion - greatest benefit is: I finally implemented
a proper accessibility for this blog.
