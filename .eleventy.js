const fs = require('fs');
const path = require('path');
const tocPlugin = require("eleventy-plugin-toc");
const markdownItAnchor = require("markdown-it-anchor");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginStats = require('eleventy-plugin-post-stats');
const markdownItFootnote = require("markdown-it-footnote");
const readingTime = require('eleventy-plugin-reading-time');
var namedCodeBlocks = require('markdown-it-named-code-blocks');
const brokenLinksPlugin = require("eleventy-plugin-broken-links");
const fileSizePlugin = require("./src/_transforms/addFileSize.js");
const postGraph = require('@rknightuk/eleventy-plugin-post-graph')
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginCleanUrls = require("@inframanufaktur/eleventy-plugin-clean-urls");
const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const eleventyPluginFilesMinifier = require("@sherby/eleventy-plugin-files-minifier");
const { fortawesomeBrandsPlugin } = require('@vidhill/fortawesome-brands-11ty-shortcode');
const { fortawesomeFreeRegularPlugin } = require('@vidhill/fortawesome-free-regular-11ty-shortcode');

function getFolderSize(folderPath) {
	let totalSize = 0;

	function traverseDirectory(currentPath) {
		const files = fs.readdirSync(currentPath);

		files.forEach((file) => {
			const filePath = path.join(currentPath, file);
			const stats = fs.statSync(filePath);

			if (stats.isDirectory()) {
				traverseDirectory(filePath);
			} else {
				totalSize += stats.size;
			}
		});
	}

	traverseDirectory(folderPath);
	return totalSize;
}

module.exports = function (eleventyConfig) {
	eleventyConfig.addPlugin(directoryOutputPlugin, {
		columns: {
			filesize: true,
			benchmark: true,
		},
		warningFileSize: 25 * 1000,
	});

	eleventyConfig.addPlugin(postGraph, { only: [2024] });
	eleventyConfig.addPlugin(pluginRss);
	eleventyConfig.addPlugin(pluginStats, { tags: ['posts', 'net nuggets'] });
	eleventyConfig.addPlugin(readingTime);
	eleventyConfig.addPlugin(fileSizePlugin);
	eleventyConfig.addPlugin(syntaxHighlight);
	eleventyConfig.addPlugin(pluginCleanUrls);
	eleventyConfig.addPlugin(fortawesomeBrandsPlugin);
	eleventyConfig.addPlugin(eleventyPluginFilesMinifier);
	eleventyConfig.addPlugin(fortawesomeFreeRegularPlugin);
	eleventyConfig.addPlugin(tocPlugin, { tags: ["h2", "h3"] });
	eleventyConfig.addPlugin(brokenLinksPlugin, {
		forbidden: "warn",
		redirect: "warn",
		broken: "warn",
		cacheDuration: "1d",
		loggingLevel: 1,
		excludeUrls: ["https://blog.davidmoll.net*", "https://github.com/Akashic101/*"],
		excludeInputs: ["./src/blog/2024-04-05-A-small-collection-of-some-great-404-pages/2024-04-05-A-small-collection-of-some-great-404-pages.md"],
		callback: null,
	});

	eleventyConfig.addPassthroughCopy("src/bundle.css");
	eleventyConfig.addPassthroughCopy("src/prism-vsc-dark-plus.css");
	eleventyConfig.addPassthroughCopy("src/assets/")
	eleventyConfig.addPassthroughCopy("src/_data/")

	eleventyConfig.addFilter("RFC3339", require("./src/_filters/RFC3339.js"));
	eleventyConfig.addFilter("cssmin", require("./src/_filters/cssmin.js"));
	eleventyConfig.addFilter("slugify", require("./src/_filters/slugify.js"));
	eleventyConfig.addFilter("readtime", require("./src/_filters/readtime.js"));
	eleventyConfig.addFilter("joinedTags", require("./src/_filters/joinedTags.js"));
	eleventyConfig.addFilter("getAllTags", require("./src/_filters/getAllTags.js"));
	eleventyConfig.addFilter("currentYear", require("./src/_filters/currentYear.js"));
	eleventyConfig.addFilter("dateDisplay", require("./src/_filters/dateDisplay.js"));
	eleventyConfig.addFilter("webmentionsByUrl", require("./src/_filters/webmentionsbyurl.js"));

	eleventyConfig.addCollection("randomArticle", require("./src/_collections/randomArticle.js"));
	eleventyConfig.addCollection("lastThreeArticles", require("./src/_collections/lastThreeArticles.js"));

	eleventyConfig.addGlobalData('lastBuildDate', () => {
		return (new Date).toUTCString();
	})

	eleventyConfig.amendLibrary("md", mdLib => mdLib.use(markdownItFootnote));
	eleventyConfig.amendLibrary("md", mdLib => mdLib.use(namedCodeBlocks));
	eleventyConfig.amendLibrary("md", mdLib => mdLib.use(markdownItAnchor, {
		permalink: markdownItAnchor.permalink.ariaHidden({
			placement: 'after'
		  })
	}));

	eleventyConfig.on('eleventy.after', async ({ dir, results }) => {
		const folderPath = dir.output;
		const sizeInBytes = getFolderSize(folderPath);
		const filePath = `${dir.output}/stats.html`;

		for (let i = 0; i < results.length; i++) {
			if (results[i].content.includes('TOTALBUILDSIZE')) {
				results[i].content = results[i].content.replace('TOTALBUILDSIZE', Math.round((sizeInBytes / 1024) * 100) / 100);
				fs.writeFileSync(filePath, results[i].content);
			}
		}
	});

	eleventyConfig.addTransform('addFileSize', require("./src/_transforms/addFileSize.js"))
	return {
		dir: {
			input: "src",
			output: "_site",
		},
	};
};