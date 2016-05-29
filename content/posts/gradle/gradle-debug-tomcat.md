---
title: Using Gradle to Debug Tomcat
created: 2014-06-22T12:00:00
authors:
  - timroes
slug: using-gradle-to-debug-tomcat
image: /banners/gradle.svg
category: Gradle
---

If you want to use Tomcat in Gradle to run your web application, you might already
be using the gradle-tomcat-plugin by Benjamin Muschko. You can simply run your web
application (with code hot swap) by running the tomcatRun task.

But unfortunately there is no task to run Tomcat in Debug mode, being able to debug from your IDE.

[[hintbox]] **UPDATE**: I recommend using the [**gretty plugin**](https://github.com/akhikhl/gretty)
for Gradle instead of the *gradle-tomcat-plugin*. It offers tasks for debugging and more
flexibility. You won’t need any of the solutions below anymore.

Possible Solution #1
--------------------

The first solution you can find in the internet is adding the debug parameters
to your gradle.properties file (e.g. in the project directory):

```
-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5008
```

This solution has a pretty large problem: it will break your code hot swap possibilities,
because now ALL your builds for this project will have these parameters, meaning
while *tomcatRun* is still running, you won’t be able to run e.g. *compileJava* so
Tomcat will refresh the newly build code. Why – because your tomcatRun task is
already using the port 5006 and your next call to gradle will lead to a "port
already in use" error.

Solution #2
-----------

To avoid the above problem, I thought it will be nice if you could build the stuff
with the parameters into the build script. I came up with an own task using the great
Tooling API of Gradle (meant for usage in IDEs). The new task you can just place
in your **build.gradle** file:

```gradle
task tomcatDebug {
   // Create a new task tomcatDebug, add a description and add it to the same group as tomcatRun
   description "Starting Tomcat with debugger enabled on port 5008."
   group "web application"
} << {

   org.gradle.tooling.ProjectConnection conn = org.gradle.tooling.GradleConnector.newConnector()
      .forProjectDirectory(new File("."))
      .connect();

   try {

      org.gradle.tooling.model.build.BuildEnvironment env = conn.getModel(org.gradle.tooling.model.build.BuildEnvironment.class)
      org.gradle.tooling.BuildLauncher build = conn.newBuild();

      build.forTasks("tomcatRun")
      // Enable debug via jvm arguments and append JVM arguments of the currently running vm (except -D).
      build.setJvmArguments("-agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5008", *env.java.jvmArguments)

      // Run tomcatRun in the new JVM with debug parameters
      build.run()

   } finally {
      conn.close();
   }
}
```

This task basically forks a new JVM with debug parameters to run tomcatRun in that
JVM. You can use this snippet for every task you would like to start in debug mode,
but which implementation runs in the Gradle task.

If you now run *tomcatDebug* you can attach your IDE to port 5008 for debugging and
code hot swap (by running compileJava in your IDE) will still work.

One small problem remains: Though we pass the original JVM parameters to the new
process, variables set via `-Dfoo=bar` won’t be passed to the debug JVM. If you need
this, you would need to enhance the above snippet to read them and pass them also
to the new JVM (but I haven’t needed it so far).
