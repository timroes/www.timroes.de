---
title: 'Groovy Tutorial for Java Developers – Part 2: Closures'
created: 2015-06-28T12:00:00
authors:
  - timroes
image: /banners/groovy.png
slug: groovy-tutorial-for-java-developers-part2-closures
series: groovy-tutorial
category: Groovy
---

[[hintbox]] This tutorial aims for developers that are already familiar with Java. It
focuses on Groovy specific features and does not explain basic programming
knowledge.

Groovy has support for **closures**, which work much
like Java 8 lambdas. A closure is an anonymous block of executable code (let's
say a function) which can be passed to variables and has access to data in the
context where it was defined. Let's look at this in a bit more detail. To define
a closure and assign it to a variable you can write as follows:

```groovy
def helloWorld = {
  println "Hello World"
}
```

The variable helloWorld now holds a reference to the closure and you can execute
it by "calling the variable":

```groovy
helloWorld()
```

## Parameters

You can also expect parameters in closures and pass them when calling:

```groovy
def power = { int x, int y ->
  return Math.pow(x, y)
}
println power(2, 3) // Will print 8.0
```

Type definition of parameters is the same like
variables. If you define a type you can only use this type, but you can also
skip the type of parameters and pass in anything you want:

```groovy
def say = { what ->
  println what
}
say "Hello World"
```

If you don't specify any
parameters (and no arrow) the closure can accept one parameter which is
available by the name *it* inside of the closure. That way you can make often
used one parameter closures even shorter, e.g. you can shorten the above to the
following (which will produce exactly the same result):

```groovy
def say = { println it }
say "Hello World"
```

If you don't pass the parameter, it will just be `null`. If you really want to
create a closure that won't be able to take an argument, you have to write the following:

```groovy
def clos = { ->
  println "This closure does not take any arguments."
}
```

## Optional Return

In Groovy the last statement of a method block (or closure) is returned
implicitly without you needing to write the return statement. This can be useful
to reduce boilerplate code to a minimum. A closure that calculates the square of
a number, can be shortened as follows:

```groovy
def square = { it * it }
println square(4) // Will print out 16
```

This closure makes usage of the implicit parameter *it* and the optional return statement.

## Passing Closures around

The power of being able to assign closures to variable is that you can also pass
them around to methods. Let's write a closure (you could of course do the same
to class methods) which will expect a closure as a parameter and a string:

```groovy
def transform = { str, transformation ->
  transformation(str)
}
```

Your transform function now can be called with a string and a closure. The
transform function will just call the passed closure with the passed string
(what makes it a pretty useless example).

```groovy
println transform("Hello World", { it.toUpperCase() })
```

This will print out *HELLO WORLD*, since
it will call the closure with Hello World as a parameter. The closure itself
just transforms it one parameter *it* to upper case and implicitly return it.

Because Groovy brims with syntactic sugar, it is allowed to close the method
parentheses and place the closure behind it:

```groovy
println transform("Hello World") { it.toUpperCase() }
```

This syntax should increase readability
(especially when the closure does not simply fit into one line. This
optimization also works when the closure is the only parameter to the method.
You can still place the closure behind the parantheses (or just skip the
parantheses, since they are anyway optional in the most cases).

## Closing of variables

Everything we've seen so far is specific to anonymous first-class functions
(often called lambda functions), but what is the specific about closures?

Closures have access to the variables in the context they were defined. Let this
demonstrate with an easy sample:

```groovy
def createGreeter = { name ->
  return {
    def day = new Date().getDay()
    if (day == 0 || day == 6) {
      println "Nice Weekend, $name"
    } else {
      println "Hello, $name"
    }
  }
}
def greetWorld = createGreeter("World")
greetWorld()
```

We call the *createGreeter* closure and pass the
name *World* to it. This closure will basically return a new closure, which we
store in the variable *greetWorld*. Whenever we call greetWorld now we will get
a nice message depending on whether it's weekend or not. We never passed the
content of the name variable to the inner closure, that we return and store in
greetWorld. We still can access it from inside the closure, because that is what
being a closure means. It has access to the variables of the context it was
defined in. In this case it was defined somewhere where a variable *name*
exists. The closure can use this variable even once it got returned and called
somewhere completely different.

*Please note* that the usage of `Date.getDay()`
is deprecated in Java and I just used it for the sake of readability in this
snippet!

## What's next?

Besides the basics we covered here, Groovy offers support for currying and
memoization. To read more about Groovys closure head over to the [official
docs](http://www.groovy-lang.org/closures.html).

The [next part](post:groovy-collections) of
this tutorial covers usage of collection types like lists and maps in Groovy.
