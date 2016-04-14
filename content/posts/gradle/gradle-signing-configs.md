---
title: Handling signing configs with Gradle
created: 2013-09-22T12:00:00
authors:
  - timroes
slug: handling-signing-configs-with-gradle
image: /banners/gradle.svg
series: gradle-signing
category: Gradle
---

If you use the Gradle build system (or Android Studio) to build your apps, you can
configure several options to sign your packages (e.g. the signing options for Android
apps, or signing maven artifacts for upload).

You most likely don’t want to check in your signing keys, passwords, usernames,
etc. into a public repository (and maybe not even into a private one). So you can
define username, password, etc. as properties in the users gradle.properties file.
That has the problem, that you now have a build file, that will fail, as long as
the user doesn’t have the properties set. I will now show you two different methods,
how you can handle your signing configs with Gradle in a clean way. To find out
where you have to place the `gradle.properties` file on your system have a look at
my [other article about gradle](post:speed-up-gradle).

Extract the whole signing config
--------------------------------

First option is, to extract the whole signing config to a separate user file.
Create a new property in your `gradle.properties`:

```-
MyProject.signing=/home/username/.signing/myproject
```

*MyProject* doesn’t need to match any application names or so, you can in fact name
the property whatever you like. Also if you’re on windows use \\\\ instead of /.

Place your keystore at **/home/username/.signing/myproject.keystore**.

Now create a file name **myproject.gradle** in **/home/username/.signing** (create the folder
	if necessary). This file will contain your signing config, that should be used to
	sign the package. This could look like the following:

```gradle
android {
  signingConfigs {
    release {
      storeFile file(project.property("MyProject.signing") + ".keystore")
      storePassword "mypassword"
      keyAlias "KeyAlias"
      keyPassword "mypassword"
    }
  }

  buildTypes {
    release {
      signingConfig signingConfigs.release
    }
  }
}
```

For more information on the signing configuration for android read their
[documentation](http://tools.android.com/tech-docs/new-build-system/user-guide#TOC-Signing-Configurations).

Now you can also see, why we didn’t put the full path (including extension) into
the gradle.properties file. That way we can use the path for the gradle build file
and the keystore.

Now its time to configure the actual build.gradle file in the project you want to
use this signing config. Just add the following lines to it:

```gradle
if(project.hasProperty("MyProject.signing")
    && new File(project.property("MyProject.signing") + ".gradle").exists()) {
  apply from: project.property("MyProject.signing") + ".gradle";
}
```

These lines will check if the MyProject.signing property has been set in your config,
and if the file it’s pointing to exists. If it does it will include the script into yours.

You can now safely checkin your build.gradle file into your repo. It will be able to sign
on your system, and won’t throw any errors on foreign systems. In fact they can also
create the MyProject.signing key and a matching .gradle file, and sign with another key.

Only extract some variables from file
-------------------------------------

If the signing config contains more information, then just the certificate, you might
want to have that parts checked into your repo as well (e.g. you configure for
maven upload, but want all the pom configuration to stay in your build.gradle).
In that case it would make sense to only extract username and password to another file.

In that case you just define some variables in your myproject.gradle file (the
include in the build.gradle should be as shown above):

```gradle
project.ext {
  uploadRepo = 'http://....'
  uploadUser = 'myusername'
  uploadPass = 'mypass'
}
```

Now make sure you only use the variables if they are available by putting the
configuration in the *if* after you loaded the file. So your build.gradle
could look like that:

```gradle
if(project.hasProperty("MyProject.signing")
    && new File(project.property("MyProject.signing") + ".gradle").exists()) {
  apply from: project.property("MyProject.signing") + ".gradle";

  // Configure stuff that relies on these variables
  uploadArchives {
    repositories.mavenDeployer {
      repository(url: uploadRepo) {
        authentication(userName: uploadUser, password: uploadPass)
      }
    }
    // .. whatever else you need ...
  }

}
```

For an tutorial on how to upload to maven with gradle see a
[blog post of Vandal Software](http://www.vandalsoftware.com/post/52468430435/publishing-an-android-library-aar-to-a-maven).

If you don’t need to also reference a keystore, you could of course put the
".gradle" into the gradle.properties file, and don’t need to append it in code.

Only extract some strings from file
----------------------------------

*From [Ricardo Amaral](https://plus.google.com/u/0/110774282522099816721)*

This method is very similar to the one before, you just use a properties file instead
a gradle file to extract data. This is better, if you just extract strings (and plain
values), but doesn’t give you support for calling other methods (what you might
want to do, to determine values dynamically, e.g. ask the user to enter the
password instead of storing it).

Again add a path to your gradle.properties (let’s do it a full path this time):

```-
MyProject.properties=/home/username/.signing/myproject.properties
```

Now add the following to your build.gradle file:

```gradle
if(project.hasProperty("MyProject.properties")
    && new File(project.property("MyProject.properties")).exists()) {

  Properties props = new Properties()
  props.load(new FileInputStream(file(project.property("MyProject.properties"))))

  android {
    signingConfigs {
      release {
        storeFile file(props['keystore'])
        storePassword props['keystore.password']
        // ...
      }
    }
  }
}
```

Just generate a plain properties file at **/home/username/.signing/myproject.properties**:

```-
keystore=/path/to/my/keystore
keystore.password=mypassword
```

Now you have your actual signing (or uploading) configuration separated to another
file. You could also use this mechanism to e.g. create company wide gradle files,
or similar external scripts.

This is also just the beginning. Gradle build scripts can be very powerful tools
in your build process. So look around what workarounds or manual interaction you
have in your current build process and see how you can solve it with gradle.

**Password prompt?** You don’t want to store your password in plaintext in your files?
Go on and read [Using password promopts with Gradle build files](post:gradle-password-prompts).
