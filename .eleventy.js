const { DateTime } = require("luxon");
const eleventyWebcPlugin = require("@11ty/eleventy-plugin-webc");
const { eleventyImagePlugin } = require("@11ty/eleventy-img");
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function (eleventyConfig) {

  eleventyConfig.addPlugin(pluginRss);
  
  // WebC
	eleventyConfig.addPlugin(eleventyWebcPlugin, {
		components: [
			// …
			// Add as a global WebC component
			"npm:@11ty/eleventy-img/*.webc",
		]
	});

	// Image plugin
	eleventyConfig.addPlugin(eleventyImagePlugin, {
		// Set global default options
		formats: ["webp", "jpeg"],
		urlPath: "/img/",

		// Notably `outputDir` is resolved automatically
		// to the project output directory

		defaultAttributes: {
			loading: "lazy",
			decoding: "async"
		}
	});

  eleventyConfig.addPassthroughCopy("src/bundle.css");
  eleventyConfig.addPassthroughCopy("src/assets/images/");
  eleventyConfig.addPassthroughCopy("src/assets/fonts/");

  eleventyConfig.addFilter("dateDisplay", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("LLLL d, yyyy");
  });

  return {
    dir: {
      input: "src",
      output: "_site",
    },
  };
};



