const { request, gql } = require('graphql-request');

// Define your GraphQL endpoint
const endpoint = 'https://api.cloudflare.com/client/v4/graphql';

// Define your Cloudflare API token
const token = 'VfMWTumouQXJcdjIBr-90L6G5ZWe2v4F4Met74T_';

const today = new Date();
const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
const formattedLastMonth = lastMonth.toISOString().slice(0, 10);

// Define your GraphQL query
const query = gql`
	query {
		viewer {
			zones(filter: { zoneTag: "be1f4f912a080de5bf33b9a33e13b0bf" }) {
				httpRequests1dGroups(filter: { date_gt: "${formattedLastMonth}" }, orderBy: [date_ASC], limit: 10000) {
					dimensions {
						date
					}
					sum {
						requests
						pageViews
					}
				}
			}
		}
	}
`;

module.exports = async function () {
	try {
		const data = await request(endpoint, query, null, {
			Authorization: `Bearer ${token}`,
		});
		// Accessing the httpRequests1dGroups array
		const websiteData = data.viewer.zones[0].httpRequests1dGroups;
		return {
			websiteViews: websiteData,
		};
	} catch (error) {
		console.error(error);
		return {
			websiteViews: null, // or handle the error accordingly
		};
	}
};
