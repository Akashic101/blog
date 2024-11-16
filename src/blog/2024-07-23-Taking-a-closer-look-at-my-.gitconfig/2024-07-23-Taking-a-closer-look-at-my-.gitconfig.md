---
layout: blog.njk
title: Taking a closer look at my .gitconfig
author: David Moll
date: 2024-07-23
tags:
  - posts
  - development
  - git
description: Dissecting my .gitconfig I use on all of my devices
folderName: 2024-07-23-Taking-a-closer-look-at-my-.gitconfig
socialMediaPreviewImage: https://blog.davidmoll.net/assets/images/2024-07-23-Taking-a-closer-look-at-my-.gitconfig/cover.png
socialMediaPreviewImageAlt: A laptop showing the git-logo
hasCode: true
hasMath: false
credits: true
---

![{{ socialMediaPreviewImageAlt }}]({{ socialMediaPreviewImage }})

Git can do so much more than just push and pull. One thing that every git-user has but not many pay attention to is their .gitconfig-file. Many are like it, but this one is mine.
It isn't long nor complicated, but it gets the job done. In this article I will show you what this file looks like and maybe you can copy a thing or two. If you want to skip to the official git-docs you can [find them here](https://git-scm.com/docs/git-config) and you can [find my own .gitconfig here](https://github.com/Akashic101/git-stuff/blob/main/.gitconfig) since this article might not reflect its current state.

## Creating a .gitconfig

There are three ways you can tell git where to operate. Each more specific gitconfig will overwrite the more general ones, for example a repo-config overwrites the user- and system-config

- System: `/etc/gitconfig`. Applies to all users on a system. Use `--system` to configure it.
- User: `~/.gitconfig`: Applies to all repositories of a user. Use `--global` to configure it.
- Repo: `.git/config`: Applies to a single repository. It is configured with no arguments.

## My .gitconfig

```ini:.gitconfig

[user]
	name = David Moll
	email = dlmoll@proton.me
	signingkey = 92F20A26EB6D74AE

[gpg]
	program = gpg

[commit]
	gpgsign = true

[alias]
	cob = checkout -b
	ci = commit
	st = status
	hist = log --graph --abbrev-commit --decorate --date=short \
		--format=format:'%C(bold cyan)%h%C(reset) %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)%an%C(reset) %C(bold yellow)%d%C(reset)' \
		--branches --remotes --tags

[init]
	defaultBranch = main

[push]
	autoSetupRemote = true

[rerere]
	enabled = true

[core]
	excludesfile = /home/david-moll/.gitignore
```

Let's do this step-by-step. The way a .gitconfig works is like an ini-file with sections (written in [brackets]), properties and values. Take for example the user-section. You do not need to open up the file and type things up, all of this can be done easily via the terminal. If you want to for example add your name and email to the config so they show up in your commits you can simply enter:

`git config --global user.name "FirstName LastName"` and `git config --global user.email "firstname.lastname@dom.ain"`

And this works for all fields, simply use `git config --global section.property "value"` and fill in the values you want to edit.

### GPG key signing

Now you might have noticed that those values are not checked. For all git cares I can say my name is Linus Torvalds. But there is a way to insure that my commits are actually from me, and that is with some magic called a public-key cryptography system. And while this article isn't on what exactly that is ([this one is though](https://ssd.eff.org/module/deep-dive-end-end-encryption-how-do-public-key-encryption-systems-work)), to cut it short this system ensures that my commits are actually done by me on my machines and commited to my private Github-account. That way when I add a commit it shows my signature, either by getting the "varified"-badge on Github or in the Terminal via `git log --show-signature`. For example the upper commit is signed while the lower one isn't:

```bash
commit f1b34db0b6b5a0d657e5ddcfb97a13046e439718 (HEAD -> main, origin/main, origin/HEAD)
gpg: Signature made 07/23/24 20:10:53 Mitteleurop<E4>ische Sommerzeit^M
gpg:                using RSA key CA2EFB872FD561BF153A989992F20A26EB6D74AE^M
gpg: Good signature from "David Moll (Private PC) <dlmoll@proton.me>" [ultimate]^M
Author: David Moll <dlmoll@proton.me>
Date:   Tue Jul 23 20:10:53 2024 +0200

    Added some basic text

commit 573040be279d3af0c1f817caf181c36ff3bba8ce
Author: David Moll <david.leander.moll@gmail.com>
Date:   Tue Jul 23 20:00:00 2024 +0200

    Added basic blog
```

To make all of this work we have to tell git to use our signinkey, which program to use to sign the commits and if they should be automatically attached to every commit:

```ini:.gitconfig

[user]
	# The signingkey to use
	signingkey = DRTFCNJ9U7V4V92D

[gpg]
	# The program used to sign
	program = gpg

[commit]
	# To automatically attach a signature to every commit
	gpgsign = true
```

If you want to go a bit more in-depth into this topic I recommend [this article about how (and why) you should sign your commits](https://withblue.ink/2020/05/17/how-and-why-to-sign-git-commits.html) and if you want to get practical there are some great docs on Github on [how to generate a new GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key) and [how to add it to your Github-Account](https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account)

### Alias

An alias is very simple explained it is just another, often easier and shorter, word to use instead of another. Take PC for example which is an alias for Personal Computer. These can be used to shorten git-commands and create new commands that do a bunch of stuff at the same time. I use for example `cob` to automatically create a new branch and switch to it, which shortens `git checkout -b name-of-branch` to just `git cob name-of-branch`. You can go really crazy with those aliases, a great example is shown in [this fantastic article](https://kiranrao.ca/2024/06/21/git-config.html) I found on Hacker News which formats a `git log` to also show a graph to each commit, showing how they relate and some other neat information in a really clean style:

```bash

hist = log --graph --abbrev-commit --decorate --date=short \
		--branches --remotes --tags \
		--format=format:'%C(bold cyan)%h%C(reset) %C(bold green)(%ar)%C(reset) %C(white)%s%C(reset) %C(dim white)%an%C(reset) %C(bold yellow)%d%C(reset)' \
```

which shows my log like this (but even more colorful)

```bash

PS C:\Users\David\blog> git hist
* f1b34db (19 minutes ago) Added some basic text David Moll  (HEAD -> main, origin/main, origin/HEAD)
* 573040b (30 minutes ago) Added basic blog David Moll
*   1b71b12 (4 weeks ago) Merge pull request #67 from Akashic101/renovate/inquirer-9.x David Moll  (webc-remake)
|\
| * 10bfb1c (4 weeks ago) Update dependency inquirer to v9.3.1 renovate[bot]
|/
*   899758c (4 weeks ago) Merge pull request #66 from Akashic101/renovate/inquirer-9.x David Moll
|\
| * 74e37cc (4 weeks ago) Update dependency inquirer to v9.3.0 renovate[bot]
|/
*   8982413 (5 weeks ago) Merge pull request #65 from Akashic101/renovate/node-20.x David Moll
|\
| * 99bae26 (5 weeks ago) Update dependency node to v20.15.0 renovate[bot]
|/
*   6ad1c9a (5 weeks ago) Merge pull request #63 from Akashic101/renovate/cssnano-7.x David Moll
|\
| * 3d2212f (5 weeks ago) Update dependency cssnano to v7.0.3 renovate[bot]
```

### Easier setup and usage

The [init]-section is very simple, in my case all it does is set the defaultBranch to `main`. You could also use `init.templateDir` to specify the directory from which a template will be copied but I have no use for this. [push] defines what happens when I push to a repo (I know, groundbreaking stuff), in my case it automatically creates an upstream I can push to so I don't have to create it first.

Now let's get really fancy. [rerere] stands for "reuse recorded resolution". It allows you to ask Git to remember how you’ve resolved a hunk conflict so that the next time it sees the same conflict, Git can resolve it for you automatically. With rerere enabled, you can attempt the occasional merge, resolve the conflicts, then back out of the merge. If you do this continuously, then the final merge should be easy because rerere can just do everything for you automatically. To get a more detailed example you can read [this article about the tool](https://git-scm.com/book/en/v2/Git-Tools-Rerere) which features some neat examples.

[core] is used in my case to point to a global .gitignore file that I have created. Since I switch between Ubuntu and Windows (and maybe even Mac in the future) I have created this global file to make sure that no files such as .DS_Store, Thumbs.db or .nfs\* are commited. It also takes care of excluding node_modules, secrets such as .env-files since most of my work is done in JS and Node. [You can find my .gitignore here](https://github.com/Akashic101/git-stuff/blob/main/.gitignore) and also cobble your own together by taking whatever you need [from this repo](https://github.com/github/gitignore).

## Other examples

I am not the first to write about this topic, if you want to see some other examples you can read them here:

- [https://kiranrao.ca/2024/06/21/git-config.html](https://kiranrao.ca/2024/06/21/git-config.html)
- [https://jvns.ca/blog/2024/02/16/popular-git-config-options/](https://jvns.ca/blog/2024/02/16/popular-git-config-options/)
- [https://github.com/artuross/dotfiles/blob/main/home/dot_config/git/config](https://github.com/artuross/dotfiles/blob/main/home/dot_config/git/config)
- [https://github.com/artuross/dotfiles/blob/main/home/dot_config/git/includes/aliases](https://github.com/artuross/dotfiles/blob/main/home/dot_config/git/includes/aliases)
- [https://news.ycombinator.com/item?id=40806875](https://news.ycombinator.com/item?id=40806875)
