module.exports = function (collectionApi) {
    const allArticles = collectionApi.getAll().filter(item => item.data.tags && item.data.tags.includes('posts')).sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    const lastThreeArticles = allArticles.slice(0, 3);

    return lastThreeArticles;
};