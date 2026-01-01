---
layout: layouts/blog.njk
title: eleventy-plugin-skiplink
author: David Moll
date: 2025-03-31
tags:
  - posts
  - accessibility
  - eleventy
  - web-development
description: How and why I created a plugin to automatically create a skiplink for 11ty
socialMediaPreviewImage: /images/7cdffbf4947c644c341c04ecd4bca48c.png
---

## Opening

One of my colleagues recently held a small course where we learned more about how to make websites more accessible for people with disabilities. His practical examples included a neat little feature that most likely 99% of users never saw in their lives before. This feature is called a skiplink, and it was so useful that I instantly jumped that night onto my laptop to create a plugin that automatically inserts such a skiplink into my 11ty-blog. In this post, I will talk about what a skiplink even is, why everyone should implement one, and how my plugin works.

## What is a skipLink?

The [Web Accessibility Initiative (WAI)](https://www.w3.org/WAI/test-evaluate/easy-checks/skip-link/) describes a skipLink like this:

"Skip links can help users quickly move past blocks of content they do not want to navigate through. The most important instance of them is a skip navigation link. This is a link at the start of a page that allows keyboard users to move straight to the main content on a page, allowing them to bypass the common content at the start of the pages. They can skip past, for example, search, menu and other navigation options."

This feature has been implemented across many websites without anyone really noticing. As an example, you can go to YouTube and press Tab three times, and a button will automatically pop up, notifying you that by clicking it or pressing Enter, you can skip the navigation. I must imagine that as a keyboard-user this would be a super useful feature to not have to navigate past the top- and side-bar on YouTube whenever you navigate to a new video. While YouTube has his skipLink hidden, other websites, such as w3.org openly present theirs in the top-bar. Both are acceptable as long as the button becomes visible when tabbing onto it.

## Why should I use a skipLink?

A skipLink has many advantages to help people with physical disabilities; for example, it can help people who are dependent on a screen-reader to navigate the often convoluted internet more easily and quicker. But it doesn't stop there; a skipLink also helps people who for example have poor dexterity or various motor disabilities or are dependent on using alternative ways of navigating online, such as mouth sticks, head pointers or various switch devices. More than 7.8 million people with severe disabilities were living in Germany alone in 2021 [^1] and are being helped by continuous improvements, not only on the internet but also in the daily life, with, for example the Barrierefreiheitsstärkungsgesetz (Accessibility Improvement Act). Personally, I believe that it is our duty as human beings to help even the weakest 1% and to make sure that they can fulfill their life to the fullest just as everyone else who has the privilege of not suffering from a disability, be it physical or mental. And with something as small as this simple skipLink we can help everyone get faster and better access to knowledge and media.

Just as an example, try to navigate around the internet using only the keyboard or close your eyes and try to navigate to your favorite news-site. It really shows that we all need to do more.

## eleventy-plugin-skiplink

Now to my plugin: Using this little extension, you will automatically be able to create a skipLink on your eleventy-page. You can find the [link to Github here](https://github.com/akashic101/eleventy-plugin-skiplink) and the [link to the NPM-package here](https://www.npmjs.com/package/eleventy-plugin-skiplink). It utilizes the [11ty-shortcodes](https://www.11ty.dev/docs/shortcodes/)-feature to insert a customizable skipLink at whatever place you want it to be, and it couldn't be easier. The first thing you have to do is download the package from NPM to your project using:

```bash
npm install eleventy-plugin-skiplink --save
```

Then navigate to your eleventy-config and add following lines to it:

```js:.eleventy.js

const skiplink = require('eleventy-plugin-skiplink');

module.exports = function (eleventyConfig) {

  eleventyConfig.addPlugin(skiplink, {
    id: 'main-content', // Defines the id that the skipLink will jump to. Enter with without #. main-content by default.
    text: 'Jump to main content' // Defines the text that the skipLink will display. Jump to main-content by default.
  });
}
```

There are two ways of styling the button. First is with inline styling like this:

```js:.eleventy.js

eleventyConfig.addPlugin(skiplink, {
  customStyles: {
    base: "position:absolute; left:50%; transform:translateX(-50%); background:#6200ee; color:white; padding:12px 24px; border-radius:4px; text-decoration:none; z-index:1000; box-shadow:0 2px 5px rgba(0,0,0,0); transition:top 0.2s ease, box-shadow 0.2s ease;",
    hidden: "top:-60px;",
    visible: "top:20px; box-shadow:0 8px 17px rgba(0,0,0,0.2); outline:none;",
  },
});
```

or by defining a custom class and styling it via CSS like this:

```js:.eleventy.js

const skipLink = require("eleventy-plugin-skiplink");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(skipLink, {
    styling: false,
    className: "my-custom-skiplink",
  });
};
```

and in your CSS-file:

```css:styling.css

.my-custom-skiplink {
	position: absolute;
	left: 50%;
	transform: translateX(-50%);
	background: #ffff00;
	color: #000000;
	font-weight: bold;
	padding: 15px 25px;
	border: 3px solid #000000;
	z-index: 9999;
	transition: top 0.3s ease;
	top: -100px; /* Hidden state */
}

.my-custom-skiplink:focus {
	top: 0; /* Visible state */
	outline: 3px solid #000000;
}
```

Last but not least you need to place the shortCode like this at the earliest point in your template-file, preferably at the first point in the `<header>`:

```njk
{% raw %}{% skipLink %}{% endraw %} {# This is an example for Nunjuck or Liquid #}
```

As the last step, you need to give the container where your content starts the id you declared in your config. If you didn't provide a custom one, you need to use `main-content`.

```html:index.html

<main id="main-content">
  <h1>Your super awesome blog made with 11ty</h1>
  ...
```

And that's it. Now if you press Tab, the button will become visible, and if you click on it or press Enter, you will instantly jump to the main content. You can see that by pressing Tab again, it should for example skip the navigation. And just with these small extra steps, you already made the internet a little bit better for everyone.

**EDIT**

darth_mall on the 11ty-Discord made a great observation that my original approach resulted in non-valid generated HTML since `<style>` is only allowed in the `<head>`, not the `<header>`. Together with vrugtehagel we workshopped an idea that works for everyone while making the component even more customizable and rendering valid html. With their help we build an approach that enables both styling via inline and class-based CSS making the plugin as adaptable as possible to everyone project out there. I can't thank the two of them enough, they where a massive help ❤️.

## Final words

Making the internet more accessible is a long and difficult task. There are so many things to keep up with and work into your page that it can quickly become very difficult to keep track of things, I myself made that mistake before. But every action counts, even if just one person can have their life a little bit easier because of that. In the future I will publish more articles about how to work around the internet in a more accessible way so more people can help out wherever they can, I am very much looking forward to sharing them.

## Footnotes

[^1]: Inclusion in facts and figures: https://www.deutschland.de/en/topic/life/inclusion-in-germany-facts-and-figures
