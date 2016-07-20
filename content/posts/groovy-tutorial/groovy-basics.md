---
title: 'Groovy Tutorial for Java Developers – Part 1: The Basics'
created: 2015-06-27T12:00:00
authors:
  - timroes
image: /banners/groovy.png
slug: groovy-tutorial-for-java-developers
series: groovy-tutorial
category: Groovy
---

[[hintbox]] This tutorial aims for developers that are already familiar with Java. It
focuses on Groovy specific features and does not explain basic programming
knowledge.

Groovy is an object-oriented programming language which
could be described as Java paired with a dynamic scripting language like
JavaScript or Python. You can use Groovy in two different "modes": You can
**compile Groovy** to JVM Bytecode like Java. That way you just need to package
it with the groovy library and it can run in the JVM like Java can. You can use
your build system (e.g. the [Groovy Gradle plugin](https://docs.gradle.org/current/userguide/groovy_plugin.html)) to use
and build Groovy in your regular projects. Besides using it in a compiled way,
you can use it as a **scripting language**. Just write your Groovy code inside a
file and execute this file by calling (once you have Groovy installed):

```-
$ groovy your-script.groovy
```

That way you can use Groovy just like you can use Python scripts for console
usage. Besides running directly from the console, Groovy offers a scripting
engine, which you can include into your Java (or Java compatible) application.
Using the scripting engine you can use Groovy as a scripting language inside
your application, like [Gradle](http://gradle.org/) does for their build
scripts. To experiment with Groovy and test the code during this tutorial, you
can also use the online Groovy Playground:

[Groovy Playground](biglink:https://groovy-playground.appspot.com/)

You can write Groovy code online and just execute it to quickly play around with some snippets. Please
notice, that the playground currently has some limitations, like
`System.out.println` not working (only the shorten version `println`, which we
will see in a moment).

## Hello World

Groovy nearly is a superset of Java, which means most of the Java code is also
valid Groovy code. It just adds a lot of syntactic sugar on top of Java. We will
illustrate this with a short example.

```groovy
System.out.println("Hello World");
```

This would be valid Java and valid Groovy. Except that you
would need at least a class with a main method around it in Java to run. In
Groovy you can just place this inside a file, execute it via the console and it
will work. But in Groovy we can shorten this line to:

```groovy
println "Hello World"
```

What has happened to the line?

1. `println` is a short form of `System.out.prinln` (and if you use the above mentioned
  Groovy Playground you will need to use it, otherwise you won't see
  any output)
2. You don't need semicolons in Groovy to end your statements (though you are still free to place them)
3. You don't need the parantheses for the method call. If Groovy can detect what of the following code is the
  argument to the method, you can omit them.

## Variables

In contrast to Java, you can use dynamic typing in Groovy. To define a variable
use the keyword **def**. That way Groovy will determine the type of the variable
at runtime and the type might even change. For example the following snippet is
valid Groovy code:

```groovy
def x = 42
println x.getClass()
x = "Hello World"
println x.getClass()
```

This script produces the output:

```-
class java.lang.Integer
class java.lang.String
```

As you can see the variable x changed its type during runtime. You are still
free to define x with a type like _int_. In that case the second assignment
would throw an error, because you explicitly told Groovy you want this variable
to be of type int and it cannot implicitly cast a String to an Integer.

## Strings

Groovy has a String implementation called GString which allow to add variables
into the String (so called String interpolation).

```groovy
def x = "World"
println "Hello, $x"
```

This would produce the output _Hello, World_. The
content of variable x is inserted into the string. If you want to use more
complex statements in the string you need to add curly braces after the dollar
sign, e.g.:

```groovy
def firstName = "Douglas"
def name = "Adams"
println "Hello, ${firstName[0]}. $name"
```

This will produce the output _Hello, D. Adams_.
If you want to use the array access operator _[x]_ you will need the curly
braces. You might have noticed, that we can access a specific character in the
string like we can access an array. Groovy offers that support, due to its
operator overloading and meta classes (which we will see further down in this
tutorial). Instead of using double quotes (") you can also use single quotes (')
as string delimiters. The difference is, that single quotes will always create a
plain Java string without any interpolation features whereas double quotes will
create a GString if necessary so that interpolation works. Therefor you will
need to escape the dollar sign in a double quotes string, if you want to print
out the dollar sign itself. Groovy also has support for **multiline strings**.
Just use three double or single quotes (with the same meaning explained above)
to create a multiline string:

```groovy
def s = """This is
a multiline
string"""
```

## Implicit Truthy

Like JavaScript Groovy evaluates every object to a boolean value if required
(e.g. when using it inside an if or when negating the value).

```groovy
if("foobar") ...
if(42) ...
if(someObject) ...
```

All these
statements are valid ifs. Groovy uses the following rules to convert any type to
boolean:

* `Strings`: If empty `false`, otherwise `true`
* `Collections` and `Maps` are `true` if they are not empty
* All non-zero numbers are `true`
* `Matchers` (from a regular expression check) are `true` if they found at least one
  match (see next chapter)
* `Iterators` with further elements are `true`
* `Object` references are `true` if they aren't `null` (you can define a
  custom truthy logic for your classes by implementing the `boolean asBoolean()` method)

For detailed examples on the truthy conversion you can check the
[official documentation](http://www.groovy-lang.org/semantics.html#Groovy-Truth).

## Regular Expressions

Groovy has some syntactic sugar around regular expressions. You can define a
regular Pattern class by placing the ~ in front of a string. Besides the already
mentioned single quote and double quotes there is a third method to define a
string, which is primarily meant for regular expressions. You can define a
string inside two slashes /../. Strings defined that way can use interpolation
and support multiline. The main difference (in contrast to """) is, that you
don't need to escape a backslash character, which you often need in regular
expression patterns. Therefor you need to escape the slash character.

```groovy
def pattern = ~/a slash must be escaped \/ but backslash, like in a digit match \d does not/
println pattern.getClass()
```

This script will show you, that pattern is of type `java.util.regex.Pattern`.

If you want to
compare a string against a regular expression (and get the Matcher to read out
the groups) you can use the find operator **=~**.

It takes a string on the left
side and a string containing a regular expression on the right side and returns
a Java Matcher, which gives access to the result. Since a Matcher instance
evaluates to `true`, when it found at least one result, you can easily use this
in an if statement:

```groovy
def matcher = "The Hitchhiker's Guide to the Galaxy" =~ /Galaxy/
if (matcher) {
  println "Found the word 'Galaxy'"
}
```

Often you want to access the result of the matcher. You can use the array index for that:

```groovy
def m = "Groovy is groovy" =~ /(G|g)roovy/
println m[0][0] // The first whole match (i.e. the first word Groovy)
println m[0][1] // The first group in the first match (i.e. G)
println m[1][0] // The second whole match (i.e. the word groovy)
println m[1][1] // The first group in the second match (i.e. g)
```

New and noteworthy Operators
----------------------------

Groovy has some noteworthy new operators, that doesn’t really belong in any other
of the chapters in this tutorial, so they should be introduced at this point.

### Safe Navigation Operator

If you want to access a property of an object "nested inside" you have to check all
the parent objects for null or your code will throw a NullPointerException. Let's
look at the following code snippet:

```groovy
if(company.getContact() != null
    && company.getContact().getAddress() != null
    && company.getContact.getAddress().getCountry() == Country.NEW_ZEALAND) { ... }
```

If null is a valid data for a contact and an address, you have to check if they are
not null before accessing their properties. This is code noise, that Groovy prevents
with the safe navigation operator ``?.` Using this operator instead of the dot no
`NullPointerException` will be thrown if any part is null. Instead the whole result
of the navigation will be null:

```groovy
if(company.getContact()?.getAddress()?.getCountry() == Country.NEW_ZEALAND) { ... }
```

If the contact or the address are `null`, the result of the left side will just be null,
but no exception will be thrown.

### Elvis Operator

The ternary operator in Java is often use to assign default values if an actual value
is not present, like in the following example:

```groovy
def name = client.getName() != null ? client.getName() : ""
```

If you want to assign a value or if its not "present" (i.e. if it evaluates to `false`)
a default value, you can use the elvis operator `?:`

```groovy
def name = client.getName() ?: ""
```

That way Groovy will assign client.getName() if it isn’t false (in case of a string
that means not null and not empty) or the empty string otherwise.

Why is this called the *Elvis Operator*? Turn your head around and look at the smileys hair.

What’s next?
------------

This tutorial has described the basics in Groovy. The [next part](post:groovy-closures)
goes into detail on the usage of closures in Groovy.
