const { DateTime } = require("luxon");

const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {

	eleventyConfig.addPlugin(pluginRss);

	eleventyConfig.addPassthroughCopy("src/bundle.css");
	eleventyConfig.addPassthroughCopy("src/assets/fonts/");
	eleventyConfig.addPassthroughCopy("src/assets/images/");

	eleventyConfig.addFilter("dateDisplay", (dateObj) => {
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL d, y");
	});

	eleventyConfig.addAsyncFilter("joinedTags", async function (tagsObj) { return tagsObj.join(", "); });

	eleventyConfig.addCollection("lastThreeArticles", function (collectionApi) {
		return collectionApi.getAll().slice(1, 4);
	});

	eleventyConfig.addCollection("randomArticle", function (collectionApi) {
		let items = collectionApi.getAll()
		return items[Math.floor(Math.random() * items.length)];
	});

	return {
		dir: {
			input: "src",
			output: "_site",
		},
	};
};



