module.exports = function (collectionApi) {
    const allArticles = collectionApi.getAll().filter(item => {
        // Exclude posts with the tag "net nuggets"
        const hasNetNuggetsTag = item.data.tags && item.data.tags.includes('net nuggets');
        return item.data.tags && item.data.tags.includes('posts') && !hasNetNuggetsTag;
    }).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    const lastThreeArticles = allArticles.slice(0, 3);

    return lastThreeArticles;
};