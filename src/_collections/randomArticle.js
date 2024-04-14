module.exports = function (collectionApi) {
	let items = collectionApi.getAll().filter((item) => {
		// Exclude items with the tag "net nuggets"
		return !(item.data.tags && item.data.tags.includes('net nuggets'));
	});

	// Check if there are remaining items after excluding "net nuggets" tagged items
	if (items.length > 0) {
		return items[Math.floor(Math.random() * items.length)];
	} else {
		return null; // Return null or handle the case where there are no items remaining
	}
};
