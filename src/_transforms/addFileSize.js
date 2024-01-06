module.exports = function (eleventyConfig) {
    eleventyConfig.addTransform("addFileSize", async (content, outputPath) => {
      if (outputPath.endsWith(".html") && content.includes('FILESIZE')) {
        const fileSize = Buffer.from(content).length;
        return content.replace('FILESIZE', Math.round((fileSize/1024) * 100) / 100);
      }
      return content;
    });
  };