---
layout: blog.njk
title: Styling an RSS Feed using XSL
author: David Moll
date: 2024-12-29
tags:
  - posts
  - RSS
  - web-development
description: Making my RSS-Feed prettier to look at
folderName: 2024-12-29-Styling-an-RSS-Feed-using-XSL
socialMediaPreviewImage: https://blog.davidmoll.net/assets/images/2024-12-29-Styling-an-RSS-Feed-using-XSL/cover.png
socialMediaPreviewImageAlt: A collection of art-brushes
hasCode: true
hasMath: true
credits: true
---

![{{ socialMediaPreviewImageAlt }}]({{ socialMediaPreviewImage }})

## Opening

Recently I learned from [Bob Monsour](https://bobmonsour.com/notes/look-ma-i-ve-styled-my-rss-feed/) that its possible to style an RSS-Feed to make it prettier to look at for humans. It is a miracle that I didn't notice this earlier considering Firefox literally notifies you about a missing stylesheet when looking at a .xml-file.

<img src="/assets/images/2024-12-29-Styling-an-RSS-Feed-using-XSL/firefox-no-stylesheet-notification.png" width=676 alt="Firefox notifying me about a missing stylesheet for an xml-file" loading="lazy">

Bob was so nice to list multiple sources to explain how this works, if you want to read them I linked them here[^1]. Here I am going to explain in my own words how I styled my RSS-Feed using XSL.

<i>Note: Creating a XSL-stylesheet requires basic knowledge of CSS and HTML</i>

## What is XSL?

XSL is a language to format stylesheets, similar to CSS. Based on CSS2 which was initially released in 1998, XSL allows you to define how a XML-document should be displayed. It also adds a transformation-language called XSLT which allows the user to format data in different ways and can be used to for example display XML-data in an HTML-file. This doesn't mean that XSL was intended to replace CSS, it was rather created to format data on the server while CSS formats it for the client.

## Use XSL in an RSS-Feed

<i>Note: I use RSS in my example but XSL also works for Atom-feeds. The markup is a little bit different, for a specific example for Atom you can use Bob Monsour's XSL-file[^1].</i>

First we need to link the XSL-stylesheet to the RSS-file. This can be done in a similar way to how its done with CSS and HTML. Place following line above the `<rss>` object, adjust the path and you are already done with the first step:

```njk:rss.xml

<?xml-stylesheet type="text/xsl" href="/assets/xsl/rss.xsl"?>
```

With that done we can get started with the styling and formatting. Take this empty template as a starting-point

```njk:rss.xls

<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:atom="http://www.w3.org/2005/Atom">

	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
			<head>
				<title>Title goes here</title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
				<style type="text/css">
				</style>
			</head>
			<body>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
```

Here you can already see an empty `<style>` and `<body>`-tag. As a simple example let's change the background-color of the rendered page:

```css:rss.xsl

<style type="text/css">
	body {
    	background-color: #181a1b;
	}
</style>
```

As you can see this is just basic CSS. You can almost any CSS-feature you want, I however noticed that features, despite beeing supported by the browser, such as [light-dark()](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/light-dark) do not work. But I do suspect that down the line those features will not be a problem anymore.

Now we get to the really interesting part. In the body we can use basic HTML with no issues, but we can expand on them with XSL. This allows us to format data, use for-loops and [many many more tricks](https://www.w3.org/TR/xslt-30/). Let's go through the important ones that we need for our RSS-Feed.

### Getting and transforming items

In this blog I use 11ty which allows me to save and access data in collections. We can render all of them in our RSS-file using Nunjuck

```njk:rss.xml
{% raw %}
{%- for post in collections.posts | reverse %}
    {%- set absolutePostUrl = post.url | absoluteUrl(metadata.url) %}
     <item>
      <title>{{ post.data.title }}</title>
      <link>{{ absolutePostUrl }}</link>
      <description>
        {{ post.data.description }}>
      </description>
      <author>{{ metadata.author.url }} ({{ metadata.author.name }})</author>
      <pubDate>{{ post.date | dateToRfc822 }}</pubDate>
      <guid>{{ absolutePostUrl }}</guid>
      <source url="{{ metadata.url }}">{{ metadata.title }}</source>
    </item>
{%- endfor %}
{% endraw %}
```

Now if we want to modify the display of every single `<item>` we can use `<xsl:for-each select="/rss/channel/item"></xsl:for-each>`. In this for-each loop we can access each so-called element of an item and use it. Let's take as a simple example the title, description and author of every item and display them in an unordered list using `<xsl:value-of`:

```njk:rss.xsl

<xsl:for-each select="/rss/channel/item">
    <ul>
        <li>
            <xsl:value-of select="title"/>
            <ul>
                <li><xsl:value-of select="description"/></li>
                <li><xsl:value-of select="author"/></li>
            </ul>
        </li>
    </ul>
</xsl:for-each>
```

We can also create hyperlinks with some tricks

```njk:rss.xsl

<a hreflang="en" target="_blank">
	<xsl:attribute name="href">
		<xsl:value-of select="link"/>
	</xsl:attribute>
		Read the article
</a>
```

Now let's take as an example the date of an item and transform it. By default I get the date in [Rfc822-format](https://www.w3.org/Protocols/rfc822/#z28) meaning I get dates such as `{% currentDate %}`. This doesn't look as good as it should so it we can treat the date as a string, cut it apart and concatinate it back together to get something better looking:

```njk:rss.xsl

<p>
	Published on:
	<xsl:value-of select="concat(substring(pubDate, 6, 2), ' ', substring(pubDate, 9, 3), substring(pubDate, 12, 5))" />
</p>
```

In a more perfect world where we get the date in yyyy-mm-dd we could do all kinds of things like using the XLST-functions `format-dateTime`, `format-date`, and `format-time` but alas we are forced to work with string-concatination. If you do are lucky enough to work with those formats you can read more about those functions [in the w3-docs](https://www.w3.org/TR/xslt20/#format-date).

## Advantages and drawbacks

XSL allows you to make anx XML-file much more pleasant to read when accessing it and with the wide variety of transformations offered by XSLT backed up by the freedom of CSS you can do some really crazy stuff with it. And in the end the XML-file will continue to be just that and can be viewed in its raw-form with out issues.

Using XSL to style an HTML-page is rarely used so it leads to different implementations on how to handle such a case across different browsers. If you try to save the rendered page you will download the HTML-page in Firefox but the XML-file in Chrome. While this is fine for RSS-Files this may become a problem for XML-files that are supposed to be downloaded. [Thanks to Robb Knight for this observation](https://social.lol/@darekkay@fosstodon.org/111793809875349055)

## Other examples

- <a href="https://darekkay.com/atom.xml">https://darekkay.com</a>
- <a href="https://photos.darekkay.com/atom.xml">https://photos.darekkay.com</a>
- <a href="https://lepture.com/feed.xml">https://lepture.com</a>
- <a href="https://daverupert.com/atom.xml">https://daverupert.com</a>
- <a href="https://thepcspy.com/feeds/full.xml">https://thepcspy.com/feeds</a>
- <a href="https://chrismorgan.info/feed.xml">https://chrismorgan.info</a>
- <a href="https://bobmonsour.com/feed.xml">https://bobmonsour.com</a>

## Footnotes

[^1]: <a href="https://cassidoo.co/post/prettify-rss/">How to make your RSS feed pretty</a> and <a href="https://darekkay.com/blog/rss-styling">Style your RSS feed</a>
