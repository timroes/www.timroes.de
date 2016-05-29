---
title: Swipe-To-Dismiss with undo in Android
created: 2013-06-15T13:00:00
authors:
  - timroes
category: Android
---

[[hintbox]] **Warning**: This library is deprecated in favor of the new [EnhancedListView](post:enhancedlistview) library.

SwipeToDismiss is a well known pattern on lists in Android. Just swipe an item left
or right off the screen, to delete it (whatever that means in the context of a specific app).

One of the design principles in Android reads as follows:

> Decide for me but let me have the final say

A well known implementation of that behavior is **not** to bother the user with
dialogs asking if they are sure abou the deletion of their content. An app should
just delete the content (*Decide for me*) but let the user undo that deletion
(*but let me have the final say*).

Unfortunately there wasn’t any library offering SwipeToDismiss with undo functionality
(to be exact there was barley a SwipeToDismiss library).

So I created a library implementing SwipeToDismiss with undo functionality:

[SwipeToDismissUndoList](github:timroes/SwipeToDismissUndoList)

The library is based on a SwipeToDismiss snippet of [Jake Wharton](https://github.com/JakeWharton/SwipeToDismissNOA),
that again is based on some of [Roman Nurik’s](https://gist.github.com/romannurik/2980593) work.
It works on every `AbsListView`.

If you want to see a working demo, check out the demo project in Google Play:

[SwipeToDismissUndo Demo](playstore:de.timroes.swipetodismiss.demo)

Read the GitHub page for implementation documentation and feel free to give
feedback. I hope this library will help you create some amazing apps!
