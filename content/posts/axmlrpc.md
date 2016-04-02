---
title: aXMLRPC — A lightweight XML-RPC library for Android
created: 2013-06-13T12:00:00
authors:
  - timroes
slug: axmlrpc-a-lightweight-xml-rpc-library-for-android
---

[XML-RPC](http://xmlrpc.scripting.com/spec.html) is a widely used remote procedure
protocol (e.g. in [WordPress](http://codex.wordpress.org/XML-RPC_Support) or
[Dokuwiki](https://www.dokuwiki.org/devel:xmlrpc)).

The common Apache XML-RPC client doesn’t work very well on Android.

Since there are less good alternatives I decided to write my own lightweight
library. I didn’t use any Android specific dependencies, so that the library
can be used in regular Java (SE or EE) as well:

[aXMLRPC on GitHub](github:timroes/aXMLRPC)
