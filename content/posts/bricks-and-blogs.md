---
title: About Bricks and Blogs
created: 2016-10-21T23:40:00
authors:
  - timroes
slug: about-bricks-and-blogs
category: Web
image: /banners/bricks-and-blogs.svg
summary: |
  A post about the technologies I use to build, deploy and deliver my blog.
---

*What software is this blog made with?* - Since I get asked this question quite
often, I wanted to write a short blog post about the software I use to build,
deploy and deliver my blog to you.

Building the blog
-----------------

When I started this blog I used WordPress as a software. In early 2016 I decided
to switch away from WordPress for several reasons (like performance, security and
the need to touch PHP for nearly everything I wanted to change).

Since this blog is - beside being my platform for content delivery - also kind of
my playground for new web technologies, performance optimizations and similar,
I decided to not use any framework or prebuild software anymore, but build it completely
from scratch.

The main templates that make up the HTML of this blog are [handlebars](http://handlebarsjs.com/)
template. I use [gulp.js](http://gulpjs.com/) to execute several tasks, that read
the content of this blog and transform it into static HTML, CSS and JavaScript.

My posts are actually written in Markdown with some YAML on top of it to describe
some meta information of the post, like its title, the authors, creation date, category
and such. This mix of YAML and Markdown is called front-matter and there are
[npm modules](https://www.npmjs.com/package/front-matter) out there to parse it.
You can check the sources of this very blog post on
[GitHub](https://raw.githubusercontent.com/timroes/www.timroes.de/master/content/posts/bricks-and-blogs.md).

To render the actual markdown to HTML, I use [marked](https://www.npmjs.com/package/marked).
Since I introduced some non-standard markdown syntax for stuff I use often, and didn't
want to inline as HTML every time (e.g. custom link types, highlighted boxes, floating images, etc.)
I overwritten the marked renderer and implemented some custom logic in it.

Since the whole blog is managed in git, I also use read out the git history and build
the list of changes, that you can expand at the top of each article.

So summed up: I write some YAML configuration and Markdown posts, wich are used in some custom
gulp tasks to build some static files, that can be served via any static hosting.

### Reading times

The reading times for each article are not part of the metadata of an article, but
are calculated during building process. I count words in each paragraph, table cell,
heading, etc. and give them different weights, e.g. 0.35 seconds for each word in
a paragraph, 0.45 seconds for each word in a heading, 1.75 seconds for each word
in a code block, 3 seconds fixed for each image, and so on.

Since I anyway have a custom renderer for markdown, I use this to calculate
these times during rendering. You can see the source code for that in the
[`Renderer.js`](https://github.com/timroes/www.timroes.de/blob/master/gulp/rendering/Renderer.js#L32)
class on GitHub.

Eventually I round the time to minutes or 5 minutes if the reading time is larger
than 15 minutes.

How have I come with the times I use for calculation? I started with values from a
[statistic](https://en.wikipedia.org/wiki/Words_per_minute#Reading_and_comprehension)
I found on Wikipedia. After that I asked several people to track their reading
times and modified the values appropriately, so hopefully they are getting more
and more accurate.

Deploying
---------

To build the actual output I use [Travis CI](https://travis-ci.org/). Which is an
awesome service and completely for free if your repository on GitHub is public.
Every time I push something to the master branch of my repository, Travis CI automatically
is triggered and builds the static output.

It than transfers the output via rsync to my virtual server hosted at [Hetzner](https://www.hetzner.de/).
To be able to transfer it, it requires the private key for that deployment account.
That key is stored encrypted in the repository and only Travis CI has the secret to
decrypt it.

But since I like challenges and like to secure my stuff, I added some second factor
for deployment, for the case anyone is ever able to decrypt the SSH key in the repository.
I created a small [telegram bot](https://core.telegram.org/bots), which asks myself
for approval before deployment.

I wrote a simple shell script - see this [gist](https://gist.github.com/timroes/0b8899654e6a54559ffb0e12dc02eed9) -
which I added before the key in the `authorized_keys` file on the server. That way
SSH will automatically force the user into this script, which will send myself
a message via telegram, and waits for me to say "Yes", before it will allow
the SSH connection to continue. If I don't answer in 40 seconds or say "No" the
connection will be aborted. The script also checks that this key can only execute
`rsync` on the server and nothing else. You can see in this screenshot how this
looks in Telegram:

![:A screenshot of my deployment bot asking for permissions:](/telegram-bot-deployment.png)

Serving
-------

Since all of my files are static I need no server side logic. That's why I shortly
switched to delivering the complete page (and not just assets) through a CDN.
Since around 65% of my visitors come from the US, it made just more sense using a CDN
than just delivering from my servers here in Germany.

I decided to use [KeyCDN](https://www.keycdn.com/?a=22192), since they have fair prices and a nice UI - which is always a must
for me. *Disclaimer: the above link is an affiliate link, which will give you $10 starting credit (instead of $1) -
which will make up for 250GB of traffic - and me some bonus if you like them too and stay with them.*

I set the caching times for the CDN itself to maximum, and let Travis CI trigger purge their cache via their API on a new deployment.
That way they the CDN theoretically "never" needs to fetch new files from my upstream server unless a deployment happened.
