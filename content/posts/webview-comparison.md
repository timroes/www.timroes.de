---
title: Old WebView vs. Chromium backed WebView Benchmark
created: 2013-11-23T12:00:00
authors:
  - timroes
slug: old-webview-vs-chromium-webview
category: Android
---

Since Android 4.4 the WebView is [backed by Chromium](https://developers.google.com/chrome/mobile/docs/webview/overview)
and not by it’s own rendering engine anymore. To see about what dimension of speed
boost we can expect, I ran several benchmark tests to compare the old WebView against
the new Chromium backed WebView.

All test were run on the very same Nexus 7 (once on Android 4.3 and once on Android 4.4).
All other running apps has been stopped (as far as that is possible) and the tablet has
been plugged in. The tests were run several times (also with restarting the app and the
tablet, the results below are average values among all runs).

Javascript Performance
----------------------

To test the Javascript performance the [Octane Benchmark v1](http://octane-benchmark.googlecode.com/svn/latest/index.html)
has been used (bigger number means better). Percentage of improvement has been rounded to whole numbers.

| TESTNAME                             | OLD WEBVIEW | CHROMIUM WEBVIEW | % IMPROV. |
|--------------------------------------|------------:|-----------------:|----------:|
| Richards (Core language features)    | 1954        | 4197             | 115%      |
| Deltablue (Core language features)   | 1996        | 2585             | 30%       |
| Crypto (Bit & Math operations)       | 4173        | 4374             | 5%        |
| Raytrace (Core language features)    | 1939        | 4050             | 109%      |
| EarleyBoyer (Core language features) | 3390        | 3769             | 11%       |
| Regexp (Strings & arrays)            | 471         | 634              | 35%       |
| Splay (Memory & GC)                  | 257         | 1177             | 358%      |
| NavierStokes (Strings & array)       | 1500        | 7102             | 284%      |
| pdf.js (Strings & array)             | 1850        | 2527             | 37%       |
| Mandreel (Virtual machine)           | 1255        | 2668             | 113%      |
| GB Emulator (Virtual machine)        | 1948        | 3107             | 59%       |
| CodeLoad (Loading & Parsing)         | 1619        | 2260             | 40%       |
| Box2DWeb (Bit & Math operations)     | 669         | 1698             | 154%      |
| OCTANE SCORE (ALL)                   | 1419        | 2644             | 86%       |

HTML5 Canvas Performance
------------------------

To test the HTML5 Canvas performance Canvasmark 2013 has been used (bigger means better).

| TESTNAME        | OLD WEBVIEW | CHROMIUM WEBVIEW | % IMPROV. |
|-----------------|------------:|-----------------:|----------:|
| CanvasMark 2013 |        3274 |            14871 |      354% |

CSS Selector performance
------------------------

To test the speed of CSS selectors a modified version of slickspeed has been used.
Each selector has been used 1000 times instead of the default 5 times. In this
test lower numbers means better (since it’s time in milliseconds).

| TESTNAME   | OLD WEBVIEV | CHROMIUM WEBVIEW | % IMPROV. |
|------------|------------:|-----------------:|----------:|
| slickspeed |       29794 |            27485 |        8% |

Conclusion
----------
The new (chromium based) WebView is faster – so far no surprise. But looking at
the numbers, the performance has really increased in several areas (like up to
354% for HTML5 Canvas or 358% for some Javascript test). So your WebView content
should run way smoother and faster then before. (But please don’t use that as an
opportunity to package your iOS like WebApp into an APK and put it into
PlayStore.. please!)

Also take care, that this has been tested on two different OS versions, meaning
the improvement might not only be the WebView implementation, but also changes
in the operating system. Since the chromium WebView was first introduced on Android
4.4 (at least without rooting devices) the results are in my opinion still showing
what performance increase you can expect – at least if you don’t root your device
and enable chromium based WebView preversion in pre Android 4.4 devices (in that
rare cases the results may differ).

Special thanks go to my company [inovex](https://www.inovex.de) for their support.
