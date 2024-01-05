const { DateTime } = require("luxon");
const CleanCSS = require("clean-css");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const brokenLinksPlugin = require("eleventy-plugin-broken-links");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginCleanUrls = require("@inframanufaktur/eleventy-plugin-clean-urls");
const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");
const { fortawesomeBrandsPlugin } = require('@vidhill/fortawesome-brands-11ty-shortcode');
const { fortawesomeFreeRegularPlugin } = require('@vidhill/fortawesome-free-regular-11ty-shortcode');

module.exports = function (eleventyConfig) {

	eleventyConfig.setQuietMode(true);

	eleventyConfig.addPlugin(directoryOutputPlugin, {
		// Customize columns
		columns: {
			filesize: true,
			benchmark: true,
		},
		warningFileSize: 25 * 1000,
	});
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPlugin(pluginCleanUrls);
	eleventyConfig.addPlugin(fortawesomeBrandsPlugin);
	eleventyConfig.addPlugin(eleventyPluginFilesMinifier);
	eleventyConfig.addPlugin(fortawesomeFreeRegularPlugin);
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
	eleventyConfig.addPassthroughCopy("src/assets/fonts/");
	eleventyConfig.addPassthroughCopy("src/assets/images/");
	eleventyConfig.addPassthroughCopy("src/assets/icons/");
	eleventyConfig.addPassthroughCopy("/Atkinson-Hyperlegible-Regular-102a.woff2");

	eleventyConfig.addFilter("cssmin", function (code) {
		return new CleanCSS({}).minify(code).styles;
	});

	eleventyConfig.addFilter("getAllTags", collection => {
		let tagSet = new Set();
		for(let item of collection) {
			(item.data.tags || []).forEach(tag => tagSet.add(tag));
		}
		return Array.from(tagSet);
	});

	eleventyConfig.addFilter("slugify", (tagToEncode) => {
		return encodeURIComponent(tagToEncode)
	});
	
	eleventyConfig.addFilter("dateDisplay", (dateObj) => {
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL d, y");
	});

	eleventyConfig.addFilter("currentYear", () => {
		return new Date().getFullYear();
	});

	eleventyConfig.addAsyncFilter("joinedTags", async function (tagsObj) { return tagsObj.join(", "); });

	eleventyConfig.addCollection("lastThreeArticles", function (collectionApi) {
		return collectionApi.getAll().slice(0, 2);
	});

	eleventyConfig.addCollection("randomArticle", function (collectionApi) {
		let items = collectionApi.getAll()
		return items[Math.floor(Math.random() * items.length)];
	})

	eleventyConfig.addGlobalData('lastBuildDate', () => {
		return (new Date).toUTCString();
	})

	return {
		dir: {
			input: "src",
			output: "_site",
		},
	};
};



