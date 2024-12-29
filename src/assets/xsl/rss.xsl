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
      					background-color: #181a1b;
					}

					a, a:visited {
					  color: #6592a2;
					}

    				#feed-container {
    				  font-family: Arial, sans-serif;
    				  margin: 20px auto;
    				  max-width: 600px;
    				  padding: 10px;
    				  background-color: #181a1b;
    				  color: #e2dfdb;
    				}

    				.feed-item {
    				  margin-bottom: 20px;
    				  padding: 15px;
    				  border-bottom: 1px solid #444;
    				}

    				.feed-item:last-child {
    				  border-bottom: none;
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
					  text-decoration: underline;
    				  display: inline-block;
    				  font-size: 1em;
					  color: #6592a2;
    				  text-decoration: none;
    				  padding: 5px 10px;
    				}
				</style>
			</head>
			<body>
				<div id="feed-container">
					<p>
						<strong>This is an RSS feed</strong>. Subscribe by copying the URL from the address bar into your newsreader. Visit <a href="https://aboutfeeds.com">About Feeds</a> to learn more and get started. It’s free!
					</p>

					<hr />

					<div>
						<header>
							<h1>
								<!-- https://commons.wikimedia.org/wiki/File:Feed-icon.svg -->
								<svg xmlns="http://www.w3.org/2000/svg" version="1.1" style="vertical-align: text-bottom; width: 1.2em; height: 1.2em;" class="pr-1" id="RSSicon" viewBox="0 0 256 256">
									<defs>
										<linearGradient x1="0.085" y1="0.085" x2="0.915" y2="0.915" id="RSSg">
											<stop offset="0.0" stop-color="#E3702D"/>
											<stop offset="0.1071" stop-color="#EA7D31"/>
											<stop offset="0.3503" stop-color="#F69537"/>
											<stop offset="0.5" stop-color="#FB9E3A"/>
											<stop offset="0.7016" stop-color="#EA7C31"/>
											<stop offset="0.8866" stop-color="#DE642B"/>
											<stop offset="1.0" stop-color="#D95B29"/>
										</linearGradient>
									</defs>
									<rect width="256" height="256" rx="55" ry="55" x="0" y="0" fill="#CC5D15"/>
									<rect width="246" height="246" rx="50" ry="50" x="5" y="5" fill="#F49C52"/>
									<rect width="236" height="236" rx="47" ry="47" x="10" y="10" fill="url(#RSSg)"/>
									<circle cx="68" cy="189" r="24" fill="#FFF"/>
									<path d="M160 213h-34a82 82 0 0 0 -82 -82v-34a116 116 0 0 1 116 116z" fill="#FFF"/>
									<path d="M184 213A140 140 0 0 0 44 73 V 38a175 175 0 0 1 175 175z" fill="#FFF"/>
								</svg>

							RSS Feed Preview
							</h1>
							<hr/>
							<h1>
								<xsl:value-of select="/rss/channel/title"/>
							</h1>
							<h3>
								<xsl:value-of select="/rss/channel/description"/>
							</h3>
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
									<xsl:value-of select="concat(substring(pubDate, 6, 2), '.', substring(pubDate, 9, 3), '.', substring(pubDate, 12, 4))" />
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
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>