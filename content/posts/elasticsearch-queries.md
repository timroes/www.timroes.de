---
title: Elasticsearch/Kibana Queries - In Depth Tutorial
created: 2016-05-20T12:00:00
authors:
  - timroes
status: draft
---

This tutorial is an in depth explanation on how to write queries in Kibana - at the search bar at the top -
or in Elasticsearch - using the [Query String Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html).
The query language used is acutally the Lucene query language, since Lucene is used inside of Elasticsearch
to index data.

There are plenty of tutorials out there explaining the Lucene query language already,
so why would I write another one? Most of these tutorials only cover the Lucene query language,
but doesn't take Elasticsearch into account. Knowing how your data is indexed in Elasticsearch
highly influence for what and how you can search with your queries.

So the topic of this tutorial isn't just explaining the query language, but also
explaining why it may or may not find your documents stored in Elasticsearch. It
should help you with some of the situations in which your query in Kibana does not
find the document you are looking for and you wonder: *why?*

If you just want some very short overview of what kind of queries you can enter into Kibana/Elasticsearch
and doesn't bother with details or haven't had any problems with documents that are not found even though
you expect them to, one of the other tutorials out there might be a better choice to start.

Indexing of documents
---------------------

First it's crucial to understand how Elasticsearch indexes data. Therefor we put the following
two documents into our imaginary Elasticsearch instance:

```json
{
  "title": "The Hitchhiker's Guide to the Galaxy",
  "author": "Douglas Adams"
}
{
  "title": "The Deeper Meaning of Liff",
  "author": "Douglas Adams"
}
```

If we didn't change anything in the Elasticsearch mappings for that index, Elasticsearch
will autodetect *string* as the type of both fields when inserting the first document.

**What does an analyzer do?** An analyzer has several tokenizers and/or filters attached to it.
The tokenizer will get the value of the field that should be index (e.g. "The Hitchhiker's Guide
to the Galaxy") and can split the value up into multiple chunks for which the user should
be able to search for (more in a moment). The filters of an analyzer can transform or filter out
tokens, that the tokenizer produces.

All the resulting tokens will be stored in a so called inverted index. That index will contain
all the tokens produced by the analyzer and a link to which of the documents contained
them. So if the user presents Elasticsearch with a search word it just needs to look it up
in the inverted index and it will instantly see which documents it needs to return.

Since we didn't specify any mapping for our Elasticsearch index, fields of the type
*string* will be analyzed with the [Standard Analyzer](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-standard-analyzer.html)
by default.

This analyzer will first split up the field value into words (it will use space-like
and punctuation characters as boundaries) and then it uses a filter to transform all
tokens to lowercase.

After inserting the above two documents the inverted index for the *title* field would look as follows,
with **1** refering to the first document ("The Hitchhiker's Guide to the Galaxy")
and **2** refering to "The Deeper Meaning of Liff":

| Term         | Documents |
|--------------|-----------|
| the          | 1, 2      |
| hitchhiker's | 1         |
| guide        | 1         |
| deeper       | 2         |
| liff         | 2         |
| of           | 2         |
| to           | 1         |
| galaxy       | 1         |
| meaning      | 2         |

An likewise inverted index will be also created for the *author* field. This will contain
two entries: one for "douglas" and one for "adams" which both are linked to both documents.

That inverted index now allows Elasticsearch to fastly look up what documents to return
for a search if the user searches for "guide". Also the Terms-Aggregation in
Elasticsearch/Kibana just looks into that inverted index and return the *terms* that
have the most/least (depending on the order the user specified) documents attached.

Mappings in Elasticsearch
-------------------------

If you insert data into elasticsearch that is not really text, but e.g. an URL or
similiar that default analyzing doesn't make much sense. Especially if you are going
to visualize your data with Kibana you don't want a graph of the top visited URLs
to contain an entry for "http" and the path split up at each slash. You would like
to just have an entry per real domain. What you want is that Elasticsearch doesn't
analyze the values in your documents.

Therefor you need to define a mapping for your index manually. This isn't covered
in that tutorial, but have a look at the [official documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html).
If you specify `index: not_analyzed` in the mapping the inverted index for the
*title* field would look as follows:

| Term                                 | Documents |
|--------------------------------------|-----------|
| The Hitchhiker's Guide to the Galaxy | 1         |
| The Deeper Meaning of Liff           | 2         |

And the inverted index of the *author* field would now look like that:

| Term          | Documents |
|---------------|-----------|
| Douglas Adams | 1, 2      |

As you see Elasticsearch doesn't split up the values anymore and also doesn't transform
them to lowercase at all.

Whether your values are analyzed or not (i.e. what terms are in the inverted index)
have a huge impact on what and how you can search for, as we will see in the following
sections. When we talk about the "analyzed data" this means, you have the data in analyzed
string fields. When we talk about "non-analyzed data" this means, that you have a mapping
that has both fields as non analyzed.

[[hintbox **Hint:** From Elasticsearch 5 on there won't be a *string* field type anymore.
Analyzed strings  will now be of type *text* and not analyzed strings are from type
*keyword* in version 5 onwards. The basic logic behind this hasn't changed. Therefor this
tutorial will continue to talk about analyzed and non-analyzed strings.
[*See changelogs*](https://www.elastic.co/de/blog/elasticsearch-5-0-0-alpha1-released#_text_keyword_to_replace_strings)]]


Simple queries on fields
------------------------

Since we now explained how Elasticsearch indexes the data, we can continue with the
actual topic: searching. The following queries can always be used in Kibana at the
top of the Discover tab, your visualization and/or dashboards. Also these queries
can be used in the [Query String Query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html)
when talking with Elasticsearch directly.

Let's start with the pretty simple query `author:douglas`. If you enter this query
on the **analyzed dataset**, Elasticsearch will return both documents. *Why?* It will
look up the term "douglas" in the inverted index for the *author* field. It is in there
linking to both documents, so Elasticsearch will return those two documents as results.

If you will use the very same search on the **unanalyzed dataset**, you will get no results.
*why?* Elasticsearch again looks up "douglas" in the inverted index. There is no entry
for just "douglas" as a term (only for "Douglas Adams"), so it won't return any results.

If you try to search for `author:Douglas` (first letter in uppercase) in the **analyzed data**
you will still get both documents as a result. *Why?* Because Elasticsearch recognizes
that the *author* field has been analyzed and tries to apply the same analyzer to
your search query "Douglas", meaning it will also be transformed lowercase before
it will be looked up in the inverted index. That's why it still finds the documents.
The same query on **unanalyzed data** will still produce no result, since there is no
entry for "Douglas" (only for "Douglas Adams").

**Attention:** There is no space allowed after the colon. Searching for `author: douglas`
is not the same as searching for `author:douglas` and most likely won't bring you any
meaningful results.

### Search for phrases

If you want to search for more then just one word, you have to put the words in quotes.
Let's now search for the whole name, using `author:"douglas adams"`.

If you skip the quotes (i.e. `author:douglas adams`), you will search for something completely
different, which we will look at a few sections further.

If you search for `author:"douglas adams"` on the **unanalyzed data** you will get..
no results (as you might have expected). *Why?* It will look in the inverted index
for an entry for "douglas adams", but there is only one for "Douglas Adams" - the
search is case sensitive. You already might have guessed it, but searching for
`author:"Douglas Adams"` will return both documents in the unanalyzed data, since that
is exactly the "key" that is stored in the inverted index.

If you search for `author:"douglas adams"` on the **analyzed data** it will return
both documents. *Why?* Again Elasticsearch recognizes, that the *author* field is analyzed
and try to apply the same analyzer to your query, i.e. splitting up by words in that case and
transforming them to lower case. After that it finds that there are two documents for the
"douglas" and the "adams" terms so it will return both. Searching for `author:"Douglas Adams"`
would return the same, since Elasticsearch applies the lowercase filter to your query
before actually searching (as mentioned above).


### Wildcard Queries

You can also use wildcards in your search query. There are two wildcards available:
**? (questionmark)** will be the placeholder for exactly one character. **\* (asterisk)**
is the placeholder for any amount of characters (including 0).

**Attention:** you cannot use wildcards inside of phrases.
If you search for `author:"Do?glas Adams"` the questionmark won't be used as a wildcard, but
must be part of the indexed value (which it isn't in our case). *Even more attention*: since
Elasticsearch applies the analyzers on your query, it might look like wildcards are working
inside phrases if you place them at the beginning/end of words - e.g. `author:"Douglas Adams*"`
will still return both documents on **analyzed data**, but not because the wildcard
worked as expected, just because the analyzer stripped that asterisk when analyzing
the query. That query wouldn't find the value "Douglas Adamsxxx".

After now showing what doesn't work (wildcards in phrases), let's look a bit on how they DO work.
Let's say we want to search for all books by authors with "doug" in the beginning of their name.
If we search for `author:doug*` on **analyzed data** we will get both documents. In contrast
searching for `author:doug` wouldn't return anything, since there is no entry in the inverted index
for "doug". When entering that query, Elasticsearch will look in the inverted index and search
for an entry that matches "doug*" (with the asterisk being an arbitrary amount of characters).
There is an entry in the inverted index (namely "douglas"), which links to both documents
so both documents will be returned.

Now we come to a probably confusing part of the query language. If we use the same
search term on **unanalyzed data** we will get no result. So far it shouldn't be
a surprise, since there is only an entry for "Douglas Adams" (uppercase letters)
in the inverted index, meaning a search for "doug\*" won't give any results.
So let's be clever and search for `author:Doug*`. From all we know until now, that should
now find the "Douglas Adams" entry in the inverted index. But if you search it, it won't
return any results.

*What is happening there?* As soon as you use wildcards in your query, Elasticsearch will
automatically lowercase your query. No matter if the field you are searching on is analyzed
or not. Meaning searching for `author:Doug*` will be converted to `author:doug*` and therefor
won't find "Douglas Adams" in the unanalyzed inverted index. If you use write a JSON query because
you are communicating with Elasticsearch directly, you can set `lowercase_expanded_terms` to `false`
in your `query_string` object to disable that behaviour. If you are searching in Kibana and
want to use wildcards when searching for uppercase values (in unanalyzed fields) you
will have to write JSON queries, which I will explain at the end of this tutorial.

Not too confused yet? Then let's jump right on to the next section.

Writing queries without a field
-------------------------------

If you just write a query like `Douglas`, Elasticsearch doesn't know in which of the
inverted indexes you want to look that term up. If you use JSON when querying Elasticsearch
directly you can specify the field it should look in with the `default_field` option
inside your `query_string` object. If you don't specify it (or entering that query in Kibana)
it will default to the [*_all*](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-all-field.html)
field. This is a special field with it's own inverted index, that Elasticsearch creates for you.
So searching for `Douglas` would be the same as searching for `_all:Douglas`.

So what is in the inverted index of the *_all* field? By default when inserting a document,
Elasticsearch will concatenate the values of all fields as one big string - no matter whether
the original field wasn't of type string or wasn't analyzed at all. It will build one
big value out of it, which will be analyzed by the standard analyzer and put into it's
own inverted index.

Let's look at one example. Assume we put the following document into Elasticsearch:

```json
{
  "some_field": "foo bar",
  "unanalyzed_field": "Douglas Adams",
  "numeric_field": 42
}
```

After that, the inverted index will look as follows:

| Term     | Documents |
|----------|-----------|
| douglas  | 1         |
| foo      | 1         |
| bar      | 1         |
| 42       | 1         |
| adams    | 1         |


Where as the inverted index of the *unanalyzed_field* will only contain the one
entry "Douglas Adams", because that field was set to unanalyzed (in our imaginary Elasticsearch mapping).

Therefor the *_all* field allows you to even search for values in unanalyzed fields by default.

Back to our previous data: searching for `Douglas` (or equivalent `_all:Douglas`) will return
both documents no matter if the data was analyzed or unanalyzed, since it was analyzed
in the _all field.

This means - looking at our **unanalyzed data** - that searching `Douglas` will return both documents,
but searching for `author:Douglas` won't return any results (even though that is the field that contains
that value). But for searching on the unanalyzed author field you would need to specify the exact
match in that inverted index ("Douglas Adams") and not the analyzed value in the inverted index of the
*_all* field.


AND &amp; OR Operators
----------------------

Until now we've only given one criteria. But of course you can also use *AND* and *OR* to
specify more then one criteria. You *MUST* write those operators in uppercase. If you write
them in lowercase they won't be detected. (In fact your might find the results strange, because it
just throws in another `_all:and` respectively `_all:or` to the query, if you write them lowercase.)

Let's search for `author:douglas AND author:adams`. Each of the query parts around the *AND*, works
as explained in the previous sections. So it does matter for each part whether the data is analyzed
or not, but it doesn't really matter for the AND/OR operators themself. That's why we will just look
at the **analyzed data** from now on.

Searching for `author:douglas AND author:adams` will return the two documents, since there is one entry
for "douglas" and one for "adams" in the inverted index, and both point to the same documents, so these
are returned.

Searching for `author:douglas OR author:terry` would result in the same two documents, since both match
the first part of the query (and it just needs to match one of the parts). `author:douglas AND author:terry`
wouldn't return any documents, since there are no documents which fullfill both parts
of the query.

If you just type in `author:douglas author:terry` Elasticsearch again needs to know whether you
meant *OR* or *AND* in that case. If you write a JSON query to Elasticsearch you can specify
which operator it should insert with the `default_operator` option inside the `query_string` object.
By default if you don't specify it (or are searching from Kibana), this will be *OR*. Meaning
`author:douglas author:terry` is equivalent to `author:douglas OR author:terry`.

In the beginning of the tutorial I mentioned how important it is to set quotes if you want to search for
phrases. I said that `author:"Douglas Adams"` searches for something completely different than
`author:Douglas Adams`. We know now everything to see that the later query searches for.
Assuming you haven't changed the `default_operator` and `default_field` this query will be equivalent
to `author:Douglas OR _all:Adams` which will result in different documents than `author:"Douglas Adams"`
most likely.

If you use more then two parts in your query, you can put parantheses around it to change the grouping.
By default Elasticsearch will first look if all *AND* operators matches before it looks at the *OR* operators.

Besides using the keywords *AND* and *OR* you can also use *&amp;&amp;* or *||* respectively.

The [official documentation](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html#_boolean_operators)
about these operators is pretty detailed.

Minus and Plus Operator
------------------------

TODO: Prefere minus and plus

Exclusion (NOT operator)
------------------------

If you want to exclude documents that match match a specific criteria, you can put a minus (-),
an exclamation mark (!) or the word *NOT* in front of that part of the query. If you want to
search for documents, containing "douglas", but not "adams", the query would be `author:douglas -author:adams`.

Take care: there musn't be a space between the minus or exclamation mark and the actual query.

Regex
-----

TODO

Range Queries
-------------

- on numeric fields
- on string fields (caution with lower/uppercase again)


Using JSON in the Kibana search
-------------------------------

TODO: Explaining how to use query DSL in the search bar in Kibana


Still not finding the data
--------------------------

- ignore_above
- modified/disabled _all field

more
----

- fuzziness
- proximity searches
- boosting
- _missing_ and _exists_
