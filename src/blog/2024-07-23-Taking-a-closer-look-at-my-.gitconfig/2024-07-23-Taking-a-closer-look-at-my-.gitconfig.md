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
socialMediaPreviewImageAlt: 
hasCode: true
---

![{{ socialMediaPreviewImageAlt }}]({{ socialMediaPreviewImage }})

Git can do so much more than just push and pull. One thing that every git-user has but not many pay attention to is their .gitconfig-file. Many are like it, but this one is mine.
It isn't long nor complicated, but it gets the job done. In this article I will show you what this file looks like and maybe you can copy a thing or two.

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
    # Of course not actually my key, just a randomly generated one
	signingkey = DRTFCNJ9U7V4V92D

[gpg]
	program = gpg

[commit]
	gpgsign = true

[alias]
	co = checkout
	ci = commit
	st = status

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

