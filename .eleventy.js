const pluginRss = require("@11ty/eleventy-plugin-rss");
const brokenLinksPlugin = require("eleventy-plugin-broken-links");
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
	eleventyConfig.addPassthroughCopy("src/prism-vsc-dark-plus.css");
	eleventyConfig.addPassthroughCopy("src/assets/")

	eleventyConfig.addFilter("cssmin", require("./src/_filters/cssmin.js") );
	eleventyConfig.addFilter("slugify", require("./src/_filters/slugify.js") );
	eleventyConfig.addFilter("joinedTags", require("./src/_filters/joinedTags.js") );
	eleventyConfig.addFilter("getAllTags", require("./src/_filters/getAllTags.js") );
	eleventyConfig.addFilter("currentYear", require("./src/_filters/currentYear.js") );
	eleventyConfig.addFilter("dateDisplay", require("./src/_filters/dateDisplay.js") );

	eleventyConfig.addCollection("randomArticle", require("./src/_collections/randomArticle.js"));
	eleventyConfig.addCollection("lastThreeArticles", require("./src/_collections/lastThreeArticles.js"));

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



