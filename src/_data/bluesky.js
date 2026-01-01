import { ActivityFeed } from "@11ty/eleventy-activity-feed";

export default async function () {
  let feed = new ActivityFeed();

  // Set cache duration to 4 hours
  feed.setCacheDuration("4h");

  feed.addSource("youtubeUser", "YouTube", "UCUbzcK18wssQSDY32rPCynw");
  feed.addSource(
    "rss",
    "Bluesky",
    "https://bsky.app/profile/davidmoll.net/rss",
  );
  feed.addSource("rss", "Blog", "https://blog.davidmoll.net/feed.xml");

  // Get the feed entries
  const entries = await feed.getEntries();

  // Return the latest posts (limit to 10 most recent)
  return entries.slice(0, 12).map((entry) => {
    // Extract image from metadata.media or entry properties
    let image = null;
    if (entry.metadata?.media?.image) {
      image = entry.metadata.media.image;
    } else if (entry.metadata?.media?.thumbnail) {
      image = entry.metadata.media.thumbnail;
    } else if (entry.image) {
      image = entry.image;
    } else if (entry.thumbnail) {
      image = entry.thumbnail;
    }

    // Extract images array if available
    let images = [];
    if (entry.metadata?.media) {
      images = Object.values(entry.metadata.media).filter(
        (url) => url && typeof url === "string",
      );
    } else if (entry.images && Array.isArray(entry.images)) {
      images = entry.images;
    }

    // Clean content - strip HTML tags and limit length
    let cleanContent = entry.content || "";
    if (typeof cleanContent === "string") {
      // Remove HTML tags
      cleanContent = cleanContent.replace(/<[^>]*>/g, "");
      // Decode HTML entities
      cleanContent = cleanContent.replace(/&nbsp;/g, " ");
      cleanContent = cleanContent.replace(/&amp;/g, "&");
      cleanContent = cleanContent.replace(/&lt;/g, "<");
      cleanContent = cleanContent.replace(/&gt;/g, ">");
      cleanContent = cleanContent.replace(/&quot;/g, '"');
      // Trim and limit length
      cleanContent = cleanContent.trim();
      if (cleanContent.length > 150) {
        cleanContent = cleanContent.substring(0, 150) + "...";
      }
    }

    // Format date
    let formattedDate = entry.date;
    if (entry.date instanceof Date) {
      formattedDate = entry.date;
    } else if (typeof entry.date === "string") {
      formattedDate = new Date(entry.date);
    }

    // Clean title - remove source label prefix if present
    let cleanTitle = entry.title || "";
    if (cleanTitle.includes(": ")) {
      cleanTitle = cleanTitle.split(": ").slice(1).join(": ");
    }

    return {
      title: cleanTitle,
      url: entry.url,
      date: formattedDate,
      content: cleanContent,
      sourceLabel: entry.sourceLabel,
      image: image,
      images: images,
    };
  });
}
