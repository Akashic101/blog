---
layout: indexLayout.njk
title: Hello World
author: David Moll
date: 2023-12-21
description: How I created my own small blog, what I am planning on doing with it and how you can create your own
---

# David's blog
<i> You can't downvote me here</i>

There are {{collections.posts.length }} articles on this blog

{% for post in collections.posts %}
## {{ post.data.title }}
<a href="{{post.url}}">{{post.data.description}}</a>
{% endfor %}