import pluginRss from '@11ty/eleventy-plugin-rss';
import markdownItFootnote from "markdown-it-footnote";
import markdownItAnchor from "markdown-it-anchor";
import htmlmin from 'html-minifier-next';
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import EleventyPluginOgImage from 'eleventy-plugin-og-image';
import { readFileSync } from 'fs';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import namedCodeBlocks from "markdown-it-named-code-blocks";

export default function (eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(eleventyImageTransformPlugin);

  eleventyConfig.addPlugin(EleventyPluginOgImage, {
    satoriOptions: {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Lato',
          data: readFileSync('src/fonts/Lato-Black.ttf'),
          weight: 900,
          style: 'normal',
        },
      ],
    },
  });
  
  // Markdown extensions
  eleventyConfig.amendLibrary("md", (mdLib) => mdLib.use(markdownItFootnote));
  eleventyConfig.amendLibrary('md', (mdLib) => mdLib.use(namedCodeBlocks));
  eleventyConfig.amendLibrary("md", (mdLib) =>
    mdLib.use(markdownItAnchor, {
      permalink: markdownItAnchor.permalink.ariaHidden({ placement: "after" }),
    })
  );

  // Static assets
  eleventyConfig.addPassthroughCopy({
    "src/css/output.css": "css/output.css",
    "src/css/input.css": "css/input.css",
    "src/images": "images",
  });
  eleventyConfig.addPassthroughCopy("src/fonts/**/*");
  eleventyConfig.addPassthroughCopy("src/js");
  eleventyConfig.addPassthroughCopy("src/robots.txt");

  // Filters
  eleventyConfig.addFilter("currentDate", () => new Date());
  eleventyConfig.addFilter("currentYear", () => new Date().getFullYear());
  
  eleventyConfig.addFilter("age", () => {
    const birthDate = new Date(1998, 2, 3);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
      age--;
    }
    return age;
  });
  
  eleventyConfig.addFilter("isOlderThanOneYear", (date) => {
    if (!date) return false;
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return date < oneYearAgo;
  });
  
  eleventyConfig.addFilter("getAllTags", (collection) => {
    const tagSet = new Set();
    for (const item of collection) {
      (item.data.tags || []).forEach((tag) => tagSet.add(tag));
    }
    return Array.from(tagSet);
  });

  eleventyConfig.addNunjucksAsyncShortcode('inlineImage', async function(imagePath) {
    const fullPath = path.join('src', imagePath);
    const base64Image = await fs.readFile(fullPath, 'base64');
    return `data:image/png;base64,${base64Image}`;
  });

  eleventyConfig.addTransform('htmlmin', async function(content) {
    if (this.page.outputPath && this.page.outputPath.endsWith('.html')) {
      let minified = await htmlmin.minify(content, {
        // Options: https://github.com/j9t/html-minifier-next?tab=readme-ov-file#options-quick-reference
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        preventAttributesEscaping: true,
        removeComments: true,
        removeOptionalTags: true,
        removeRedundantAttributes: true,
      });
      return minified;
    }
    return content;
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
