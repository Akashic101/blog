require('dotenv').config();
const Cache = require('@11ty/eleventy-cache-assets');

module.exports = async function () {
  try {
    const params = new URLSearchParams();
    params.append('url', 'https://blog.davidmoll.net');
    params.append('key', process.env.PAGESPEED_API_KEY);
    params.append('fields', 'lighthouseResult.categories.*.score,lighthouseResult.categories.*.title');
    params.append('prettyPrint', false);
    params.append('strategy', 'mobile');
    params.append('category', 'PERFORMANCE');
    params.append('category', 'ACCESSIBILITY');
    params.append('category', 'BEST-PRACTICES');
    params.append('category', 'SEO');

    let data = await Cache(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`, {
      duration: '1d',
      type: 'json',
    });

    if (!data || !data.lighthouseResult || !data.lighthouseResult.categories) {
      throw new Error('Invalid response format');
    }

    data = data.lighthouseResult.categories;

    Object.keys(data).map(function (key) {
      data[key].score = Math.min(Math.max((data[key].score * 100).toFixed(), 0), 100)
    });

    return {
      categories: data,
    };
  } catch (error) {
    console.error('An error occurred:', error.message);
    // You can choose to return a default value or an empty object, depending on your use case.
    return {
      categories: {},
    };
  }
};

