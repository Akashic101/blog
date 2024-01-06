module.exports = function (collectionApi) {
    let items = collectionApi.getAll()
    return items[Math.floor(Math.random() * items.length)];
};