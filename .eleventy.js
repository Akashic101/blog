const { DateTime } = require("luxon");
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");

const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {

	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

	eleventyConfig.addPassthroughCopy("src/bundle.css");
	eleventyConfig.addPassthroughCopy("src/assets/fonts/");
	eleventyConfig.addPassthroughCopy("src/assets/images/");
	eleventyConfig.addPassthroughCopy("src/assets/icons/");

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



