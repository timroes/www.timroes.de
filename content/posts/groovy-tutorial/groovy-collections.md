---
title: 'Groovy Tutorial for Java Developers – Part 3: Collections'
created: 2015-06-28T14:00:00
authors:
  - timroes
image: /banners/groovy.png
slug: groovy-tutorial-for-java-developers-part3-collections
series: groovy-tutorial
category: Groovy
---

[[hintbox]] This tutorial aims for developers that are already familiar with Java. It
focuses on Groovy specific features and does not explain basic programming
knowledge.

This part of the Groovy tutorial series focus on the usage of lists and maps in
Groovy. It will require an understanding of Groovy
closures. If you are not familiar with closures in Groovy, you can head to the
[second part](post:groovy-closures) of this tutorial to learn about them.

## Lists

Groovy offers a shortcut method to create a new list:

```groovy
def list = [1,1,2,3,5]
```

This will create an `ArrayList` with the given numbers in
it. To access a list element you can use the overloaded array index accessor:

```groovy
println list[0] // will print 1
println list[-1] // negative indexes for access from the end of the list, will print out 5
```

### Finding Elements

To check whether a specific element is contained inside a list you can use the *in* operator:

```groovy
if (4 in list) { ... }
```

### Transformation and Filtering

Due to the existance of closures (as explained in the previous tutorial part)
there are easy ways to iterate, filter and transform lists. To iterate over a
list you can use the *each* method on a list:

```groovy
list.each {
  println it
}
```

As you see we made our code more groovyish by omitting the method
call parantheses and just pass the closure. The passed closure will be executed
once for each element in the list and the list element will be passed as a
parameter (here implicitly *it*) to the closure.

Note that all of these methods
work on any Java Collection. No matter if you created it the short way as shown
above or if comes from a Java part of your program and has been created the
"traditional" way.

To filter a list you can use the method *findAll*:

```groovy
def even = list.findAll { it % 2 == 0 }
```

The findAll method
creates a new list, by calling the passed closure for every element in the list
and adding it to the new list if the closure returns a value that evaluates to
`true` (see first tutorial part for Groovy truthy).

If you are just interested
in the first element of the list that matches a given criteria, you can use the
*find* method instead. It also takes a closure and will return the first element
for which the closure evaluates to `true`.

If you need to transform each element of a list you can use the *collect* method:

```groovy
def squaredList = list.collect { it * it }
```

This will create a new list by transforming each element in *list* by the given closure.

If the only transformation you want to do in the collect closure is calling a method
on each element, like in the following:

```groovy
def upper = ["Hello", "World"].collect { it.toUpperCase() }
```

For these cases Groovy has again a syntactic sugar operator called
the *spread-dot operator*. You can express the above with the operator as
follow:

```groovy
def upper = ["Hello", "World"]*.toUpperCase()
```

Beside the mentioned methods the Collection (and Iterable) interfaces provide some more
methods, like `any` or `every` to check whether any element or every element
inside the list fullfills a specific condition (expressed by a closure).
To see all further methods you can check the
[Collection documentation](http://docs.groovy-lang.org/latest/html/groovy-jdk/java/util/Collection.html)
in the Groovy docs.

## Maps

Similiar to lists Groovy also has some more convenient method to instantiate maps.

```groovy
def key = 'Key3'
def aMap = [
  'Key1': 'Value 1', // Put key1 -> Value 1 to the map
  Key2: 'Value 2', // You can also skip the quotes, the key will automatically be a String
  (key): 'Another value' // If you want the key to be the value of a variable, you need to put it in parantheses
]
```

After this initialization you will get a new `LinkedHashMap` with the entries:
*Key1 -> Value1, Key2 -> Value 2, Key3 -> Another Value*. If you want to create an empty
map with this syntax you can write: `def map = [:]`

To access entries in the map you can again use square brackets:

```groovy
println aMap['Key1'] // Access the key Key1
println aMap[key] // Access the entry with the value of key variable
```

Beside using brackets you can also use dot notation to access entries:

```groovy
println aMap.Key1 // Access Key1 entry
```

If the key has
characters in it, that can't be parsed as an identifier (e.g. a space) you can
still use the dot syntax with quotes around it: `aMap.'Key With Spaces'`. Since
in my opinion this looks kind of strange I don't give it its own box. You can
even use interpolated Strings with this syntax, like: `aMap."$key"`, which is
the same as `aMap[key]`.

### Transforming and Filtering

For filtering and transforming tasks you have the same methods than for lists
with a slightly different syntax:

```groovy
map.each {
  println it.key
  println it.value
}
```

Instead of the value you will get the entry of the map on
which you can access the key and value as shown above. The each method can also
take a closure with two parameters in which case it will put key and value into
these parameters. So you could express the above also as:

```groovy
map.each { key, value ->
  println key
  println value
}
```

The same rule applies for the
`find`, `findAll`, `any` and `every`. You can either accept one argument in the
closure in which case you will get the entry or you can directly accept the key
and value separated. `Any` and `every` return again a boolean value, `findAll`
will create a new map ony containing the entries, for which the closure
evaluated to `true`, and the `find` method will return the first entry (and not
just the value) for which the closure evaluated to `true`.

The only method that
behaves quite different is the `collect` method. The collect method will (also
on maps) create a list as an output. It will iterate over all entries in the map
and pass them (as a single or as two parameters) to the closure. The objects you
return from the closure will be added all to a list (and not a map). That way
the following does **not** work as someone might expect:

```groovy
map.collect { return it }
```

This will result in you having an `ArrayList` of Map
entries, which most likely is not what you want. You can use the collect method
if you somehow want to collect a map to a list of values. If you want to
transform a map into another map you have to use the `collectEntries` method:

```groovy
map.collectEntries {
  return it
}
```

You can return a map entry
from the closure, which will be put to the new map (so the example above will
just create the very same map again). If you want to create new entries you can
return a map (most often with just one entry) from the closure:

```groovy
map.collectEntries { key, value ->
  return [(key): value]
}
```

This snippet does the same as the one above. It will just add every entry again to
the new map. You can even return a map with more then one entry. In this case
all entries in the map will be put to the new map:

```groovy
map.collectEntries { key, value ->
  def newKey = key + "^2"
  return [(key): value, (newKey): value*value]
}
```

This snippet will add each entry and a new one with the original key suffixed
by *^2* and the value squared to a new map.

## What's next?

This was the last part of this short tutorial series on Groovy for Java
developers. Groovy offers a lot more complex mechanisms than explained here.
Especially intersting might be techniques like [operator
overloading](http://www.groovy-lang.org/operators.html#Operator-Overloading) and
meta classes (which allow to add or overwrite methods on any existing class). If
you want to learn more you can head to the official [Groovy
documentation](http://www.groovy-lang.org/documentation.html). I hope you
enjoyed the tutorial and if you wish for more parts on some more specific
topics, feel free to leave a comment below.
