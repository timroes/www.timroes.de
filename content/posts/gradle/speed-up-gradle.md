---
title: How To… Speed up Gradle build time
created: 2013-09-12T12:00:00
authors:
  - timroes
image: /banners/gradle.svg
Category: Gradle
---

[[hintbox]] Gradle wrote a pretty lengthy article on how to [improve the performance of your build](https://gradle.github.io/performance-guide/).
I highly recommend to read this to further improve your build performance.

If you use the new Gradle build system with Android (or Android Studio) you might
have realized, that even the simplest Gradle call (e.g. gradle project or grade tasks)
is pretty slow. On my computer it took around eight seconds for that kind of Gradle
calls. You can decrease this startup time of Gradle (on my computer down to two seconds),
if you tell Gradle to use a [daemon](http://www.gradle.org/docs/current/userguide/gradle_daemon.html)
to build.

[[hintbox]] Since Gradle 3.0 the daemon is [turned on by default](https://docs.gradle.org/current/release-notes#improved-gradle-daemon,-now-enabled-by-default).

Just create a file named `gradle.properties` in the following directory:

* /home/&lt;username>/.gradle/ (*Linux*)
* /Users/&lt;username>/.gradle/ (*Mac*)
* C:\\Users\\&lt;username>\\.gradle (*Windows*)

Add this line to the file:

```
org.gradle.daemon=true
```

From now on Gradle will use a daemon to build, whether you are using Gradle from command
line or building in Android Studio. You could also place the `gradle.properties` file to
the root directory of your project and commit it to your SCM system. But you would
have to do this, for every project (if you want to use the daemon in every project).

**Note**: If you don’t build anything with Gradle for some time (currently 3 hours),
it will stop the daemon, so that you will experience a long start-up time at the next build.

**Note**: Performance improvements are one of the great tasks in the Gradle roadmap for 2014
(and reaching into 2015). So I hope, we’ll see the general performance increasing within these years.

**Note**: This does only affect console builds. Android Studio always uses a Gradle
daemon (and depending on your settings some other optimizations).
