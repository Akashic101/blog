const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

// Function to validate non-empty input
const validateInput = (input) => {
    return input.trim() !== '' ? true : 'This field is required.';
};

// Function to generate files based on user input
async function generateFiles() {
    const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in the format YYYY-MM-DD

    const answers = await inquirer.prompt([
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
    ]);

    // Create the variables from the supplied answers
    let { title, description, includeCode } = answers;

    // The title of the folder uses "-" instead of spaces, so we replace them all
    folderTitle = title.replace(/\s+/g, '-');

    // Create the paths for the blog and images
    const blogFolderPath = path.join(__dirname, 'src', 'blog', `${currentDate}-${folderTitle}`);
    const assetsFolderPath = path.join(__dirname, 'src', 'assets', 'images', `${currentDate}-${folderTitle}`);

    // Create the folders
    fs.mkdirSync(blogFolderPath, { recursive: true });
    fs.mkdirSync(assetsFolderPath, { recursive: true });

    const frontmatter = `---
layout: blogLayout.njk
title: ${title}
author: David Moll
date: ${currentDate}
tags: 
- posts
description: ${description}
folderName: ${currentDate}-${folderTitle}
socialMediaPreviewImage: https://blog.davidmoll.net/assets/images/${currentDate}-${folderTitle}/cover.png
socialMediaPreviewImageAlt: 
hasCode: ${includeCode}
---

![{{ socialMediaPreviewImageAlt }}]({{ socialMediaPreviewImage }})
`;

    // Write the frontmatter-data in a file to the blog-path
    fs.writeFileSync(path.join(blogFolderPath, `${currentDate}-${folderTitle}.md`), frontmatter);

    console.log(`Blog folder "${currentDate}-${folderTitle}" and Markdown file created successfully.`);
}

generateFiles();
