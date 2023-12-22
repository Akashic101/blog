---
layout: indexLayout.njk
title: Hello World
author: David Moll
date: 2023-12-21
description: How I created my own small blog, what I am planning on doing with it and how you can create your own
---
<hr>

## Latest articles 
{% for post in collections.posts %}

<div class="flex-container">
    <div class="image-container">
        <img src="../../assets/images/{{post.data.folderName}}/cover.png" alt="{{ post.data.description }}" class="image" width="200" height="200">
    </div>
    <div class="text-container">
        <h1 class="main-title">{{ post.data.title }}</h1>
        <p class="date">{{post.date | dateDisplay}}</p>
        <p class="description">{{post.data.description}}</p>
        <a class="read-more-link" href="{{ post.url }}">Read More</a>
    </div>
</div>
{% endfor %}
<hr>
<p>See all posts in <a href="https://blog.davidmoll.net/archive">the archive</a></p>
<hr>

## Random article

<div class="flex-container">
    <div class="image-container">
        <img src="../../assets/images/{{collections.randomArticle.data.folderName}}/cover.png" alt="{{ collections.randomArticle.data.description }}" class="image" width="200" height="200">
    </div>
    <div class="text-container">
        <h1 class="main-title">{{ collections.randomArticle.data.title }}</h1>
        <p class="date">{{ collections.randomArticle.data.date | dateDisplay }}</p>
        <p class="description">{{ collections.randomArticle.data.description }}</p>
        <a class="read-more-link" href="{{collections.randomArticle.url}}">Read More</a>
    </div>
</div>
<hr>