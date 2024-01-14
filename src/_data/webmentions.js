const EleventyFetch = require("@11ty/eleventy-fetch");

module.exports = async function () {
  const WEBMENTIONS_BOBM = "2LpS37LH-dL93j5e6l-VRQ";
  const url = `https://webmention.io/api/mentions.jf2?token=${WEBMENTIONS_BOBM}&per-page=1000`;
  const res = EleventyFetch(url, {
    duration: "1h",
    type: "json",
  });
  const webmentions = await res;
  console.log(webmentions)
  return {
    mentions: webmentions.children,
  };
};