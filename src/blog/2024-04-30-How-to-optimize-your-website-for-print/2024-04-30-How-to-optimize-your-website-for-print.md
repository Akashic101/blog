---
layout: blog.njk
title: How to optimize your website for print
author: David Moll
date: 2024-04-30
tags:
  - posts
  - web-development
description: Neat little tricks on how to make your website looking better for print
folderName: 2024-04-30-How-to-optimize-your-website-for-print
socialMediaPreviewImage: https://blog.davidmoll.net/assets/images/2024-04-30-How-to-optimize-your-website-for-print/cover.png
socialMediaPreviewImageAlt:
hasCode: true
---

![{{ socialMediaPreviewImageAlt }}]({{ socialMediaPreviewImage }})

Not many know this, but there is a neat little media-query you can use in CSS to style your website specifically for print. With this you can have multiple designs for your website, for example `@media screen` can be used for styling your website for all kinds of screens while `@media print` does the same but for, you guessed it, print. This allows you to for example hide advertisements, overlays or critical data that shouldn't be printed. In this post I'll show you some common optimizations you can do for your website to make it better looking on paper.

## Body

The `<body>` tag defines the document's body which contains all the contents of an HTML document, such as headings, paragraphs, images, hyperlinks, tables, lists, etc. Normally you can use all kinds of colors to style your website, but these are not always a good idea on paper. A dark background for example like I use will waste tons of ink, so it is a good idea to remove all colors from the background and text. It is also a good idea to reset your margin while you are at it

```css:bundle.css

body {
		background-color: #ffffff;
		background-image: none;
		color: #000000;
		margin: 0;
	}
```

## Hide elements

You might want to hide some content on paper but show it on screen. For this you can choose some general tags you want to hide like `footer` or anchors in headings but you can also use something like `<div class="screenOnly">` to hide those elements. Personally I chose this to hide my navBar since it has no use on paper. The CSS for this can look like this:

```css:bundle.css

footer, .screenOnly, h1 > a {
    display: none;
}
```

## Hyperlinks

Hyperlinks have a unique problem where they by nature hide what they are pointing at. But don't worry, you can easily reveal their target with a little css-trickery:

```css:bundle.css

a::after {
		content: ' (' attr(href) ')';
}
```

## Avoid breaking

If your content is long enough you run into the problem that some parts of it may start on page 1 but don't end there and continue into page 2. This breaking can be really annoying, especially in elements like tables, images or sections. There are multiple ways on how to handle this issue The shown CSS-code is just an example to show the feature, you do not have to use these.

### break-after

The `break-after` property specifies whether or not a page break, column break, or region break should occur after the specified element. This means that if you for example have an image with a class that has this styling applied and it would break across pages it will instead move down and start at the second page.

```css:bundle.css

footer {
    break-after: always;
}
```

### break-before

The `break-before` property is the direct counterpart to `break-after`. With this the content will not be split onto the second page but the first page if possible.

```css:bundle.css

h1 {
    break-before: always;
}
```

<div class="avoidBreakInside">

### break-inside

The last property allows you to simply say to avoid content being split across pages. It's something very general you can use in multiple places to make your printed website a bit more readable:

```css:bundle.css

table,
img,
svg,
code,
pre {
	break-inside: avoid;
}
```

</div>
### font-size

Something small you can do to make sure everything is properly readable is to write some general rules for the size of text. This can go for all headings and paragraphs in general

```css:bundle.css

h1 {
    font-size: 28px;
}

h2 {
	font-size: 24px;
}

h3 {
	font-size: 20px;
}

h4 {
	font-size: 18px;
}

h5 {
	font-size: 16px;
}

h6 {
	font-size: 14px;
}

p {
	font-size: 16px;
}
```

<div class="avoidBreakInside">

## Custom footer

You can adjust the content of your body by adding some content to it that is only visible when printing. This can be done by using the so-called pseudo-element `::after`. You can also insert line-breaks by using `\A` wherever you want a line to end. You will also need `white-space: pre` for this to work.

```css:bundle.css

body::after {
	content: 'Here goes the content you want to display\A And here the one in the second line';
	display: block;
	text-align: center;
	white-space: pre;
}
```

</div>
These are some simple CSS-tricks that will help you to optimize your website a little bit. Did you use any of those? Let me know, I'd love to have a look at your page :)
