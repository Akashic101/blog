module.exports = function (collectionApi) {
    let wordCounter = 0;
    let readingTime = 0; 

    for (let i = 0; i < collectionApi.length; i++) {
        cleanText = collectionApi[i].content.replace(/<\/?[^>]+(>|$)/g, "");
        wordCounter += cleanText.trim().split(/\s+/).length;
    }

    readingTime = wordCounter / 240
    return Math.round(readingTime);
};
