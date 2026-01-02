---
permalink: /tags/
layout: layouts/base.njk
eleventyExcludeFromCollections: true
title: All Tags
filter:
  - posts
socialMediaPreviewImage: /images/27a8398f0173e557c93bad1f910375e7_1920x300_light.png
socialMediaPreviewImageAlt: Tags - David Moll's Blog
---

<div class="container mx-auto px-4 py-8">
  <h1 class="text-4xl font-bold mb-8">Tags</h1>
  
  <div class="flex flex-wrap gap-3">
    {% for tag in collections.all | getAllTags %}
      {% if tag != "posts" %}
        {% set tagUrl %}/tags/{{ tag | slugify }}/{% endset %}
        <a href="{{ tagUrl }}" class="inline-block bg-indigo-100 hover:bg-indigo-200 text-indigo-800 hover:text-indigo-900 px-4 py-2 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md">
          {{ tag }}
        </a>
      {% endif %}
    {% endfor %}
  </div>
</div>
