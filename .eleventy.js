const markdownit = require("markdown-it");
const anchor = require("markdown-it-anchor");
const tocPlugin = require("eleventy-plugin-toc");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginStats = require('eleventy-plugin-post-stats');
const readingTime = require('eleventy-plugin-reading-time');
const brokenLinksPlugin = require("eleventy-plugin-broken-links");
const fileSizePlugin = require("./src/_transforms/addFileSize.js");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginCleanUrls = require("@inframanufaktur/eleventy-plugin-clean-urls");
const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");
const { fortawesomeBrandsPlugin } = require('@vidhill/fortawesome-brands-11ty-shortcode');
const { fortawesomeFreeRegularPlugin } = require('@vidhill/fortawesome-free-regular-11ty-shortcode');

module.exports = function (eleventyConfig) {

	eleventyConfig.addPlugin(directoryOutputPlugin, {
		columns: {
			filesize: true,
			benchmark: true,
		},
		warningFileSize: 25 * 1000,
	});
	
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginStats, { tags: ['posts'] });
	eleventyConfig.addPlugin(readingTime);
	eleventyConfig.addPlugin(fileSizePlugin);
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPlugin(pluginCleanUrls);
	eleventyConfig.addPlugin(fortawesomeBrandsPlugin);
	eleventyConfig.addPlugin(eleventyPluginFilesMinifier);
	eleventyConfig.addPlugin(fortawesomeFreeRegularPlugin);
	eleventyConfig.addPlugin(tocPlugin, { tags: ["h1", "h2", "h3"] });
	eleventyConfig.addPlugin(brokenLinksPlugin, {
		redirect: "warn",
		broken: "error",
		cacheDuration: "1d",
		loggingLevel: 1,
		excludeUrls: ["https://blog.davidmoll.net*", "https://github.com/Akashic101/*"],
		excludeInputs: [],
		callback: null,
	});

	eleventyConfig.addPassthroughCopy("src/bundle.css");
	eleventyConfig.addPassthroughCopy("src/prism-vsc-dark-plus.css");
	eleventyConfig.addPassthroughCopy("src/assets/")

	eleventyConfig.addFilter("cssmin", require("./src/_filters/cssmin.js"));
	eleventyConfig.addFilter("slugify", require("./src/_filters/slugify.js"));
	eleventyConfig.addFilter("readtime", require("./src/_filters/readtime.js"));
	eleventyConfig.addFilter("joinedTags", require("./src/_filters/joinedTags.js"));
	eleventyConfig.addFilter("getAllTags", require("./src/_filters/getAllTags.js"));
	eleventyConfig.addFilter("currentYear", require("./src/_filters/currentYear.js"));
	eleventyConfig.addFilter("dateDisplay", require("./src/_filters/dateDisplay.js"));

	eleventyConfig.addCollection("randomArticle", require("./src/_collections/randomArticle.js"));
	eleventyConfig.addCollection("lastThreeArticles", require("./src/_collections/lastThreeArticles.js"));

	eleventyConfig.addGlobalData('lastBuildDate', () => {
		return (new Date).toUTCString();
	})

	eleventyConfig.setLibrary("md", markdownit().use(anchor));

	eleventyConfig.addTransform('addFileSize', require("./src/_transforms/addFileSize.js"))
	return {
		dir: {
			input: "src",
			output: "_site",
		},
	};
};