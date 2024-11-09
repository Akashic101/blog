import fs from 'fs/promises';
import path from 'path';
import url from 'url';
import inquirer from 'inquirer';

// Function to validate non-empty input
const validateInput = (input) => {
	return input.trim() !== '' ? true : 'This field is required.';
};

// Function to prompt user for inputs
async function getUserInputs() {
	return await inquirer.prompt([
		{
			type: 'input',
			name: 'title',
			message: 'Enter the title:',
			validate: validateInput,
		},
		{
			type: 'input',
			name: 'description',
			message: 'Enter the description:',
			validate: validateInput,
		},
		{
			type: 'confirm',
			name: 'includeCode',
			message: 'Does the markdown file include code?',
			default: false,
		},
		{
			type: 'input',
			name: 'coverImagePath',
			message: 'Enter the path to the cover image:',
			validate: validateInput,
		},
	]);
}

// Function to create necessary folders
async function createFolders(blogFolderPath, assetsFolderPath) {
	try {
		await fs.mkdir(blogFolderPath, { recursive: true });
		await fs.mkdir(assetsFolderPath, { recursive: true });
	} catch (error) {
		console.error('Error creating folders:', error);
		throw error;
	}
}

// Function to copy cover image
async function copyCoverImage(coverImagePath, newCoverImagePath) {
	try {
		await fs.copyFile(coverImagePath, newCoverImagePath);
	} catch (error) {
		console.error('Error copying cover image:', error);
		throw error;
	}
}

// Function to write markdown file
async function writeMarkdownFile(blogFilePath, frontmatter) {
	try {
		await fs.writeFile(blogFilePath, frontmatter);
	} catch (error) {
		console.error('Error writing markdown file:', error);
		throw error;
	}
}

// Main function to generate files
async function generateFiles() {
	const currentFileUrl = import.meta.url;
	const currentDir = path.dirname(url.fileURLToPath(currentFileUrl));
	const currentDate = new Date().toISOString().split('T')[0];

	try {
		const answers = await getUserInputs();

		const { title, description, includeCode, coverImagePath } = answers;
		const folderTitle = title.replace(/\s+/g, '-');
		const blogFolderPath = path.resolve(currentDir, 'src', 'blog', `${currentDate}-${folderTitle}`);
		const assetsFolderPath = path.resolve(
			currentDir,
			'src',
			'assets',
			'images',
			`${currentDate}-${folderTitle}`,
		);
		const coverImageFileName = path.basename(coverImagePath);
		const newCoverImagePath = path.join(assetsFolderPath, coverImageFileName);
		const blogFilePath = path.join(blogFolderPath, `${currentDate}-${folderTitle}.md`);

		await createFolders(blogFolderPath, assetsFolderPath);
		await copyCoverImage(coverImagePath, newCoverImagePath);

		const frontmatter = `---
layout: blog.njk
title: ${title}
author: David Moll
date: ${currentDate}
tags: 
- posts
description: ${description}
folderName: ${currentDate}-${folderTitle}
socialMediaPreviewImage: https://blog.davidmoll.net/assets/images/${currentDate}-${folderTitle}/${coverImageFileName}
socialMediaPreviewImageAlt: 
hasCode: ${includeCode}
---

![{{ socialMediaPreviewImageAlt }}]({{ socialMediaPreviewImage }})
`;

		await writeMarkdownFile(blogFilePath, frontmatter);

		console.log(
			`Blog folder "${currentDate}-${folderTitle}" and Markdown file created successfully.`,
		);
	} catch (error) {
		if (error.isTtyError) {
			console.error("Prompt couldn't be rendered in the current environment.");
		} else if (error.message && error.message.includes('User force closed the prompt')) {
			console.log('Prompt was cancelled.');
		} else {
			console.error('An error occurred:', error);
		}
	}
}

generateFiles();
