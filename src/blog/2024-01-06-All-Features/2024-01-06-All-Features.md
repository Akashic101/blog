---
layout: blogLayout.njk
title: All features of this blog
author: David Moll
date: 2024-01-06
tags: 
- posts
- 100%
- features
description: All the neat little features this blog has to offer
folderName: 2024-01-06-All-Features
socialMediaPreviewImage: https://blog.davidmoll.net/assets/images/2024-01-06-All-Features/cover.png
socialMediaPreviewImageAlt: A list placed on a clipboard laying on a table
hasCode: true
---

![{{ socialMediaPreviewImageAlt }}]({{ socialMediaPreviewImage }})


*Notice: This blog is part of a series called "100%" in which I describe the steps I took to cover all cases a website can face and get the maximum out of what a feature can offer. You can find all articles in this series [under the 100%-tag](https://blog.davidmoll.net/tags/100%25/)*

Over time this blog has aquired quite the list of features. If you want to create your own blog using eleventy, or already have one and are looking for stuff to include, this list is perfect to use as an inspiration.

## RSS

You can recieve updates of all my posts automatically using RSS, this is done with the [Eleventy-RSS-plugin](https://github.com/11ty/eleventy-plugin-rss). You can read more on how I set up RSS [in this post](http://blog.davidmoll.net/blog/2024-01-05-100-RSS)

## Comments

You can leave a comment under any post on this blog using [https://github.com/giscus/giscus](Giscus). This plugin uzilizes Github Discussion to automatically create a post for every blog and displays all comments at the bottom of this post. Scroll to the end of the website to see for yourself.

## Tags

Every post has multiple tags describing the content of itself. If you want a list of all tags you can visit [https://blog.davidmoll.net/tags](https://blog.davidmoll.net/tags) to see a list of all of them and from there also see all articles that include a specific tag. You can for example see all posts about my 100%-series under [https://blog.davidmoll.net/tags/100%25/](https://blog.davidmoll.net/tags/100%25/)

## Auomatic external link checker

To not give link rot any chance I am running a plugin called [eleventy-plugin-broken-links](https://www.npmjs.com/package/eleventy-plugin-broken-links) that checks every link on my website during the build-process and automatically warns me if any website is no longer reachable.

## Open Graph Images

All blog-posts have a automatically generated card with the title of the blog, the cover-image, the description and the link that gets displayed when you share an article. Go ahead and paste for example this article itself in Discord, Linkedin, Teams, Twitter or any other social-media website and you will see the generated image.

## Minifier

During build there are multiple steps I take to reduce the size of the final folder. One is [eleventy-plugin-files-minifier](@sherby/eleventy-plugin-files-minifier) that automatically minimizes all files such as HTML, CSS and JS during the build-process. Another step is automatically inlining all CSS-files with `clean-css`. This filter removes the potential external request for example the styling of PrismJS and automatically bundles it all in the HTML-file as a `<style>`-tag.

## Edit on GitHub Links

You can see at the bottom of the page a link on every page on this website that links to the corresponding source on Github. This enables me to automatically edit pages even when I am not at home.

## Clean URL's

Sometimes I have to link to an external website, those sometimes sneak in a small little tracker in the URL which I do not want. Google recently started doing this with Youtube, if you use the share-button on a video it adds a `si`-parameter to the URl, ironically making it longer instead of shorter than the URL displayed in the browser itself (great job Google). With [eleventy-plugin-clean-urls](https://github.com/inframanufaktur/eleventy-plugin-clean-urls) all trackers in URL's get automatically removed during build, making the web just a little bit safer and private for everyone.

## Syntax Highlighting

Since I often share code-snippets on this website I decided to use PrismJS to highlight the snippets correctly. All of this is powered by [eleventy-plugin-syntaxhighlight](https://www.11ty.dev/docs/plugins/syntaxhighlight/) together with the [prism-vsc-dark-plus theme](https://github.com/PrismJS/prism-themes/blob/master/themes/prism-vsc-dark-plus.css). The best part is, this css-file only gets loaded on blog-posts which need syntax-highlighting, all of that automatically inlined and minimized. Have a look at the [blogLayout.njk](https://github.com/Akashic101/blog/blob/main/src/_includes/blogLayout.njk) template on how this is achieved.

## Icons

No matter where you view the website, you will see an optimized icon everytime. This is done using [https://realfavicongenerator.net/](https://realfavicongenerator.net/) which generated a bundle with the main icon that gets automatically bundled when building the website.

## Benchmark

This website uses a few benchmarks to test its performance. Firstly it is registered in the [Eleventy Leaderboards](https://www.11ty.dev/speedlify/) which shows its lighthouse-value and performance over time. On my side I am using a plugin called [eleventy-plugin-directory-output](https://www.11ty.dev/docs/plugins/directory-output/) which benchmarks my website during build and shows the size of all files plus additional warnings if any file is too big.

## Anchors and table-of-content

Using [markdown-it-anchors](https://github.com/valeriangalliat/markdown-it-anchor) and [eleventy-plugin-toc](https://github.com/jdsteinbach/eleventy-plugin-toc) each site automatically generates a table of content and adds permalinks to every header on the website that is also visible when hovering the heading. Special thanks to [Rhian van Esch](https://rhianvanesch.com/posts/2021/02/09/adding-heading-anchor-links-to-an-eleventy-site/) for showing me how to do this.

## Filesize

Every site shows how big the HTML-file is that the user is reading the article on. This is done with a plugin I wrote:

```js
{% raw %}module.exports = function (eleventyConfig) {
  eleventyConfig.addTransform("addFileSize", async (content, outputPath) => {
    if (outputPath.endsWith(".html") && content.includes('FILESIZE')) {
      const fileSize = Buffer.from(content).length;
      return content.replace('FILESIZE', Math.round((fileSize / 1024) * 100) / 100);
    }
    return content;
  });
};{% endraw %}
```

## Font-Awesome

On my [about-me](https://blog.davidmoll.net/about-me/) page I am using Font-Awesome to display a few SVG's of a few skills I have and ways to reach me. To minimize the size of the icons and remove icons I do not need I am using two plugins, [fortawesome-brands-11ty-shortcode](https://github.com/vidhill/fortawesome-brands-svg-11ty-shortcode) and [fortawesome-regular-svg-11ty-shortcode](https://github.com/vidhill/fortawesome-regular-svg-11ty-shortcode)

---

This website is continuesly beeing worked on and there will always be new features and additions that make this blog even better. If you have any tips and tricks I should use feel free to share them with me and the community.