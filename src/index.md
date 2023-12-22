---
layout: indexLayout.njk
title: Hello World
author: David Moll
date: 2023-12-21
description: How I created my own small blog, what I am planning on doing with it and how you can create your own
---

## Latest articles 
{% for post in collections.lastThreeArticles %}
### {{ post.data.title }}
<i>{{post.data.date | dateDisplay }}</i><br>
<a href="{{post.url}}">{{post.data.description}}</a>
{% endfor %}

## Random article

### {{ collections.randomArticle.data.title }}
<i>{{collections.randomArticle.data.date | dateDisplay }}</i><br>
<a href="{{collections.randomArticle.url}}">{{collections.randomArticle.data.description}}</a>