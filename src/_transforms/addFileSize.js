const htmlmin = require('html-minifier');

module.exports = function (eleventyConfig) {
	eleventyConfig.addTransform('addFileSize', async (content, outputPath) => {
		if (outputPath.endsWith('.html') && content.includes('FILESIZE')) {
			let minifiedHTML = htmlmin.minify(content, {
				useShortDoctype: true,
				removeComments: true,
				collapseWhitespace: true,
				minifyCSS: true, // Minify CSS in style elements and style attributes
				minifyJS: true, // Minify JavaScript in script elements and event attributes
				removeAttributeQuotes: true, // Remove quotes around attributes when possible
				removeEmptyAttributes: true, // Remove empty attributes
				removeRedundantAttributes: true, // Remove redundant attributes like type="text/javascript"
				removeScriptTypeAttributes: true, // Remove type="text/javascript" from script tags
				removeStyleLinkTypeAttributes: true, // Remove type="text/css" from style and link tags
				removeOptionalTags: true, // Remove optional tags like </head>, </body>, etc.
				removeTagWhitespace: true, // Remove whitespace between tags
			});

			const fileSize = Buffer.from(minifiedHTML).length;
			return content.replace('FILESIZE', Math.round((fileSize / 1024) * 100) / 100);
		}
		return content;
	});
};
