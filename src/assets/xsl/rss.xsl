<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="3.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:atom="http://www.w3.org/2005/Atom">

	<xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>

	<xsl:template match="/">
		<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
			<head>
				<title>David Moll's RSS feed</title>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
				<style type="text/css">
					body {
						background-color: #121314;
						color: #e2dfdb;
						margin: 0;
						padding: 0;
					}

					a, a:visited {
						color: #6592a2;
					}

					#feed-container {
						display: grid;
						grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
						gap: 20px;
						margin: 20px;
						padding: 20px;
						box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
					}

					.feed-item {
						background-color: #181a1b;
						color: #e2dfdb;
						border-radius: 8px;
						padding: 20px;
						transition: transform 0.3s ease-in-out; /* CSS3 Transition */
					}

					.feed-item:hover {
						transform: translateY(-10px); /* Hover effect for a floating animation */
					}

					.feed-title {
						font-size: 1.5em;
						color: #e2dfdb;
						margin: 0 0 10px;
					}

					.feed-pubdate {
						font-size: 0.9em;
						color: #aaa;
						margin: 0 0 5px;
					}

					.feed-author {
						font-size: 0.9em;
						color: #aaa;
						margin: 0 0 10px;
					}

					.feed-link {
						display: inline-block;
						font-size: 1em;
						color: #6592a2;
						text-decoration: none;
						padding: 5px 10px;
						border: 1px solid #6592a2;
						border-radius: 4px;
						transition: background-color 0.3s ease;
					}

					.feed-link:hover {
						background-color: #6592a2;
						color: #fff;
					}
				</style>
			</head>
			<body>
				<div id="feed-container">
					<header>
						<h1>RSS Feed Preview</h1>
						<hr/>
						<p>
							<strong>This is an RSS feed</strong>. Subscribe by copying the URL from the address bar into your newsreader. Visit <a href="https://aboutfeeds.com">About Feeds</a> to learn more and get started. It’s free!
						</p>
						<a hreflang="en" target="_blank">
							<xsl:attribute name="href">
								<xsl:value-of select="/rss/channel/link"/>
							</xsl:attribute>
								&#x2190; Go back to blog.davidmoll.net
						</a>
					</header>

					<xsl:for-each select="/rss/channel/item">
						<div class="feed-item">
							<h2 class="feed-title">
								<xsl:value-of select="title"/>
							</h2>
							<p>
								<xsl:value-of select="substring-after(description, '&gt;')" />
							</p>
							<p class="feed-pubdate">
    							Published on: 
								<xsl:value-of select="concat(substring(pubDate, 6, 2), ' ', substring(pubDate, 9, 3), substring(pubDate, 12, 5))" />
							</p>

							<p class="feed-author">Author: <xsl:value-of select="author" />
							</p>
							<a hreflang="en" target="_blank">
								<xsl:attribute name="href">
									<xsl:value-of select="link"/>
								</xsl:attribute>
									Read the article
							</a>
						</div>
					</xsl:for-each>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>
