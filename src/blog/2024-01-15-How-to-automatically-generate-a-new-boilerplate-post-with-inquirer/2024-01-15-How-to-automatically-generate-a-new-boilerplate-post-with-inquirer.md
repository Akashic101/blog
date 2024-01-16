---
layout: blogLayout.njk
title: How to automatically generate a new boilerplate-post with inquirer
author: David Moll
date: 2024-01-15
tags: 
- posts
- eleventy
description: How I automated the creation of the boilerplate with frontmatter
folderName: 2024-01-15-How-to-automatically-generate-a-new-boilerplate-post-with-inquirer
socialMediaPreviewImage: https://blog.davidmoll.net/assets/images/2024-01-15-How-to-automatically-generate-a-new-boilerplate-post-with-inquirer/cover.png
socialMediaPreviewImageAlt: A robot sitting on a laptop
hasCode: true
---

![{{ socialMediaPreviewImageAlt }}]({{ socialMediaPreviewImage }})

With this project growing more and more automating some parts is becoming a must. Step 1 of every article I write is creating the necessary files and while I already automated [the creation of the cover-image](/blog/2024-01-04-100-Images/) I also want to automate the creation of the new files with all the frontmatter that I need to start with a new post. In this post I explain how I manage this so others can use it too for their projects.

<hr/>

## Structure

One of the best parts of eleventy is that it doesn't force you into a specific layout. Everything goes, try out what fits best for your use-case. For me I have two folders in the src-folder that include either the images or the posts itself. The structure looks as following:

```md
blog/
└── src/
    ├── assets/
    │   └── images/
    │       └── 2024-01-15-How-to-automatically-generate-a-new-boilerplate-post-with-inquirer/
    │           └── cover.png
    └── blog/
        └── 2024-01-15-How-to-automatically-generate-a-new-boilerplate-post-with-inquirer/
            └── 2024-01-15-How-to-automatically-generate-a-new-boilerplate-post-with-inquirer.md
```

Yours can look completely different and thats fine, but my code will probably not work and will need some tinkering if your structure is different.

## Frontmatter

Frontmatter is a way to identify metadata in Markdown files. Metadata can literally be anything you want it to be, but often it's used for data elements your page needs and you don't want to show directly. My frontmatter-data for this specific post you are reading looks like this:

```md
---
layout: blogLayout.njk
title: How to automatically generate a new boilerplate-post with inquirer
author: David Moll
date: 2024-01-15
tags: 
- posts
- eleventy
description: How I automated the creation of the boilerplate with frontmatter
folderName: 2024-01-15-How-to-automatically-generate-a-new-boilerplate-post-with-inquirer
socialMediaPreviewImage: https://blog.davidmoll.net/assets/images/2024-01-15-How-to-automatically-generate-a-new-boilerplate-post-with-inquirer/cover.png
socialMediaPreviewImageAlt: A robot sitting on a laptop
hasCode: true
---
```

This data can then be reused for example in templates and markdown so you don't have to write the same thing dozens of times and bring some dynamic into static websites.

## Inquirer

[Inquirer](https://github.com/SBoudrias/Inquirer.js) is an amazing package that allows you to create dynamic command line user interfaces. If you have created a new NPM-project before you probably already experienced this where NPM asks you for certain details to be filled in the `package.json`. We are using the same to automate the creation of our files.

First I created a new file in the root of the directory I am working in and named it `generateNewBlog.js`. 

I imported the packages that I need 

```js
const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
```

and wrote a function that checks if an answer the user gives is empty. Since the input I am looking for is required I can use this to make sure I am getting all the data I need.

```js
// Function to validate non-empty input
const validateInput = (input) => {
    return input.trim() !== '' ? true : 'This field is required.';
};
```

Next up is the actual interesting part. We create a new `inquirer.prompt` and input the questions we need.

```js
async function generateFiles() {
    // Get today's date in the format YYYY-MM-DD
    const currentDate = new Date().toISOString().split('T')[0];

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
```

We then use the data we get back to create the folders we need 

```js
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
```

Next up we create the frontmatter-template and fill in all the data that is always given such as the layout and the author. We can also fill in the title, date, folderName, socialMediaPreviewImage and hasCode:

```js
const frontmatter = `
---
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
```

The last step is creating a markdown-file in the blog-folder with the above defined data in it as a template:

```js
// Write the frontmatter-data in a file to the blog-path
fs.writeFileSync(path.join(blogFolderPath, `${currentDate}-${folderTitle}.md`), frontmatter);
```

And thats already all that is needed. The complete file looks like this:

```js
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
```

If I execute this file with `node .\generateNewBlog.js` and fill in the asked question inquierer automatically creates all the files that I need and I can instantly start writing. As always if you have any notes or questions feel free to post them in the comments.

On a sidenote this website now (should) support webmentions. If you share this article on any website, for example Mastodon your profile should appear below next time the website is build.