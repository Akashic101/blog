# Blog

<img src="./src/assets/icons/android-chrome-512x512.png" alt="Blog's logo" align="right" width="120" height="120">

This is the repo of my personal blog powered by 11ty. You can access it under https://blog.davidmoll.net or via RSS at https://blog.davidmoll.net/feed.xml

## How It Works

1. Each article gets written in Markdown
2. 11ty converts all files into HTML upon launch of the project into a folder called `_site`
3. The website is accessible from my server via Cloudflare Tunnel 

## Patch Notes

**Version 0.0.1**
- Added index
- Added about-me
- Added archive
- Added first articles

## Roadmap
- Full coverage of WCAG 2.2 and eventually WCAG 3.0
- Better design
- Improved hosting similar to [LOW←TECH MAGAZINE](https://solar.lowtechmagazine.com/about/the-solar-website/)

## Icons

All icons were generated with [RealFaviconGenerator](https://realfavicongenerator.net/) [v0.16](https://realfavicongenerator.net/change_log#v0.16)

## Installation

- Clone this repo with `git clone https://github.com/akashic101/blog`
- Navigate into this repo with `cd blog`
- Install all dependencies with `npm install`
- Build the site with `npx @11ty/eleventy`
- Navigate to http://localhost:8080 to see the website
