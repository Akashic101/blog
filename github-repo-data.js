const { Octokit } = require('@octokit/rest');
const repositoryURLs = require('./repos');

// Initialize Octokit with your personal access token
const octokit = new Octokit({ auth: process.env.GITHUB_SECRET });

// Function to extract owner and repo name from repository URL
function extractOwnerAndRepo(url) {
	const parts = url.split('/');
	const owner = parts[parts.length - 2];
	const repo = parts[parts.length - 1];
	return { owner, repo };
}

// Function to count open issues and pull requests
async function countOpenIssuesAndPRs(repository) {
	try {
		const response = await octokit.issues.listForRepo({
			owner: repository.owner,
			repo: repository.repo,
			state: 'open',
		});

		// Count open issues and pull requests
		const openIssuesCount = response.data.filter((issue) => !issue.pull_request).length;
		const openPRsCount = response.data.filter((issue) => issue.pull_request).length;

		// Return total issues count and PRs count
		return {
			repository: `${repository.owner}/${repository.repo}`,
			openIssues: openIssuesCount,
			openPRs: openPRsCount,
		};
	} catch (error) {
		console.error(
			`Error counting open issues and pull requests for repository ${repository.owner}/${repository.repo}:`,
			error.message,
		);
		// Return 0 for both counts if an error occurs
		return {
			repository: `${repository.owner}/${repository.repo}`,
			openIssues: 0,
			openPRs: 0,
		};
	}
}

// Sort repositories based on the number of issues and pull requests
async function sortRepositoriesByIssuesAndPRs() {
	const repositoriesWithCounts = await Promise.all(
		repositoryURLs.map((url) => {
			const { owner, repo } = extractOwnerAndRepo(url);
			return countOpenIssuesAndPRs({ owner, repo });
		}),
	);

	// Sort repositories by number of issues and pull requests
	repositoriesWithCounts.sort((a, b) => {
		if (a.openIssues !== b.openIssues) {
			return b.openIssues - a.openIssues; // Sort by number of issues descending
		} else {
			return b.openPRs - a.openPRs; // Sort by number of PRs descending if issues count is equal
		}
	});

	return repositoriesWithCounts;
}

// Print sorted repositories
async function printSortedRepositories() {
	const sortedRepositories = await sortRepositoriesByIssuesAndPRs();
	sortedRepositories.forEach((repository) => {
		console.log(
			`Repository: ${repository.repository} (https://github.com/${repository.repository})`,
		);
		console.log(`Open Issues: ${repository.openIssues}`);
		console.log(`Open Pull Requests: ${repository.openPRs}`);
		console.log('---');
	});
}

printSortedRepositories();
