---
title: Using password prompts with gradle build files
created: 2014-01-19T12:00:00
authors:
  - timroes
slug: using-password-prompts-with-gradle-build-files
image: /banners/gradle.png
series: gradle-signing
category: Gradle
---

In my post [Handling signing configs with gradle](post:gradle-signing-configs)
I introduced several options how to extract private signing information from your
build file and store it outside of your repository.

One questions remained in that post: How to handle passwords of signing keys in
your build file. In the previous article I just put them to the external build or
property files. Depending on where you store these you might not want to put
plaintext passwords in there – perhaps you even don’t want to do this, if you store
your property files secure.

This article describes how to ask the user for a password during the build process.

Gradle gives you access to the console via `System.console()`. The console offers a
method to read passwords, so that you can do:

```gradle
def password = System.console().readPassword("\nPlease enter key passphrase: ")
```

Now use the content of password wherever you need to apply the password, and we
are done.. oh no wait, would be a very short post, so let’s talk about the problems.

Problem #1 – Don’t bother me all the time
-----------------------------------------

If you put this line somewhere in your build.gradle you will notice that it will
execute this line every time you build something. It doesn’t care if you need to
sign anything in this build or not, it will ask you anyway.

To solve that problem we can use the [TaskGraph](http://www.gradle.org/docs/current/javadoc/org/gradle/api/execution/TaskExecutionGraph.html)
in Gradle to check if we are executing a task, that needs the key at all. Since
the task graph will be populated in the beginning of the build (but won’t be finished
until the build files have been read) we need to wait until the taskGraph has been populated:

```gradle
gradle.taskGraph.whenReady { taskGraph ->
  // Executed when the task graph is ready (and can be accessed via taskGraph parameter)
}
```

Just place this snippet in your build file and the inner code will execute when
the task graph is ready.

So now let’s check if we are executing a task that needs the password. The task
graph has a method `hasTask()` to check whether a specific task will be executed
during this build. You need to specify the task name as a parameter. You must
also add a colon in front of the name for the root directory. If the task is defined
in a specific submodule (as it usually is in Android projects) you also have to
specify this modules name. Let’s assume your project has a module named *app*
(as Android Studio normally creates it) and we need the key password if we execute
*assembleRelease*. We can now do the following check:

```gradle
gradle.taskGraph.whenReady { taskGraph ->
  if(taskGraph.hasTask(':app:assembleRelease')) {
    // Only execute when we are trying to assemble a release build
    def pass = System.console().readPassword("\nPlease enter key passphrase: ")
    // readPassword returns a char[] so we need to wrap it into a string, because that's
    // most likely what you need
    pass = new String(pass)
    // Use the pass variable here (so set signing configs here)
  }
}
```

Now Gradle won’t bother you unless you need the password.

Problem #2 – We don’t have a console
------------------------------------

If you try to execute the above from inside an IDE (like Android Studio) or with
[gradle.daemon turned on](post:speed-up-gradle), you won’t have a console
(`System.console()` will return `null`) and your build will fail due to an exception.
But no panic, let’s solve that problem. If we don’t have access to a console, we
can still use a UI. We can use Groovy’s SwingBuilder to show a simple password input dialog.

At first you need to import at, so put the following line at top of your build.gradle file:

```groovy
import groovy.swing.SwingBuilder
```

Now you can use the `SwingBuilder` to show a simple input dialog:

```groovy
def pass = ''
new SwingBuilder().edt {
  dialog(modal: true, // Otherwise the build will continue running before you closed the dialog
      title: 'Enter password', // Dialog title
      alwaysOnTop: true, // pretty much what the name says
      resizable: false, // Don't allow the user to resize the dialog
      locationRelativeTo: null, // Place dialog in center of the screen
      pack: true, // We need to pack the dialog (so it will take the size of it's children
      show: true // Let's show it
  ) {
    vbox { // Put everything below each other
      label(text: "Please enter key passphrase:")
      input = passwordField()
      button(defaultButton: true, text: 'OK', actionPerformed: {
        pass = input.password; // Set pass variable to value of input field
        dispose(); // Close dialog
      })
    }
  }
}
```

Insert this code at the place where you need to ask for the password and you will
get the user entered password in the `pass` variable.

Put it all together
-------------------

Let’s put it all together. A UI is nice (okay the above one isn’t, but feel free
to modify the dialog in whatever way you want: [SwingBuilder docs](http://groovy.codehaus.org/Swing+Builder))
but perhaps sometimes you will build from a system that has only a console not a graphical
interface (like a build server) and sometimes from your IDE. Also you would
like to cancel the build if the user didn’t enter a password. So your final
build file can look like that:

```gradle
gradle.taskGraph.whenReady { taskGraph ->
  if(taskGraph.hasTask(':app:assembleRelease')) {

    def pass = ''
    if(System.console() == null) {
      new SwingBuilder().edt {
        dialog(modal: true, // Otherwise the build will continue running before you closed the dialog
            title: 'Enter password', // Dialog title
            alwaysOnTop: true, // pretty much what the name says
            resizable: false, // Don't allow the user to resize the dialog
            locationRelativeTo: null, // Place dialog in center of the screen
            pack: true, // We need to pack the dialog (so it will take the size of it's children)
            show: true // Let's show it
        ) {
          vbox { // Put everything below each other
            label(text: "Please enter key passphrase:")
            input = passwordField()
            button(defaultButton: true, text: 'OK', actionPerformed: {
              pass = input.password; // Set pass variable to value of input field
              dispose(); // Close dialog
            })
          } // vbox end
        } // dialog end
      } // edt end
    } else {
      pass = System.console().readPassword("\nPlease enter key passphrase: ")
      pass = new String(pass)
    }

    if(pass.size() <= 0) {
      throw new InvalidUserDataException("You must enter a password to proceed.")
    }

    // -----
    // Do what you need to do with pass here!
    // -----

  } // end if has task
} // end whenReady
```

Feel free to dig into the Groovy documentation and see how you can improve this UI
if you feel like. I know that you can also bind variables in Swing to model values,
just seemed to much overhead for this tutorial.
