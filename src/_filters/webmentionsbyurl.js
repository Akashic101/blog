const sanitizeHTML = require("sanitize-html");
module.exports = function webmentionsByUrl(webmentions, url) {
  const allowedTypes = {
    likes: ["like-of"],
    reposts: ["repost-of"],
    comments: ["mention-of", "in-reply-to"],
  };

  const sanitize = (entry) => {
    if (entry.content && entry.content.html) {
      entry.content = sanitizeHTML(entry.content.html, {
        allowedTags: ["b", "i", "em", "strong", "a"],
      });
    }
    return entry;
  };

  const pageWebmentions = webmentions
    .filter(
      (mention) => mention["wm-target"] === "https://www.bobmonsour.com" + url
    )
    .sort((a, b) => new Date(b.published) - new Date(a.published))
    .map(sanitize);

  const likes = pageWebmentions
    .filter((mention) => allowedTypes.likes.includes(mention["wm-property"]))
    .filter((like) => like.author)
    .map((like) => like.author);

  const reposts = pageWebmentions
    .filter((mention) => allowedTypes.reposts.includes(mention["wm-property"]))
    .filter((repost) => repost.author)
    .map((repost) => repost.author);

  const comments = pageWebmentions
    .filter((mention) => allowedTypes.comments.includes(mention["wm-property"]))
    .filter((comment) => {
      const { author, published, content } = comment;
      return author && author.name && published && content;
    });

  const mentionCount = likes.length + reposts.length + comments.length;
  const data = { likes, reposts, comments, mentionCount };
  return data;
};