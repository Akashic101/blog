---
layout: blog.njk
title: The worst password-field I have ever seen
author: David Moll
date: 2024-04-21
tags:
  - posts
  - web-development
description: how a very badly configured password-field damaged my user-experience
folderName: 2024-04-21-The-worst-password-field-I-have-ever-seen
socialMediaPreviewImage: https://blog.davidmoll.net/assets/images/2024-04-21-The-worst-password-field-I-have-ever-seen/cover.png
socialMediaPreviewImageAlt: A laptop secured with a padlock
hasCode: true
---

![{{ socialMediaPreviewImageAlt }}]({{ socialMediaPreviewImage }})

I recently ran into an incredibly bad experience with a password-field which made me categorize my thoughts about the topic and write them down. It all started when I wanted to sign up to a new website, something I have done hundreds of times before. The website had a very simple sign-up process, enter your e-mail, enter your password, confirm your account via an e-mail, easy enough. However when I reached the step of entering my password I ran into the most badly configured password-field I have ever seen

```html:HTML

<input id="password1" name="password1" type="password" value="" maxlength="32" autocomplete="new-password" onblur="if (this.value !== '') ajaxCheck('CheckPassword', {'password1' : this.value, 'password2' : $('#password2').val(), 'personal' : false}, '#passwordError');" tabindex="3">
```

At first glance this might not seem to bad, but the devil is in the detail. `maxlength` has absolutely nothing to do in a password-field. The problem I ran into was that for maximum security I use Bitwarden to generate a new 128-character password for every website. When I entered the password I instantly noticed that not the entire password was pasted, inspecting the HTML showed why. `maxlength` makes sure every character above 32 gets removed. Now this on its own could be explained by having a password-rule of a maximum of 32 characters but this is not the case here. The only rules shown on the website are:

- Mimimum characters of 8
- At least 1 letter, one special character and one number

Which does get enforced by the website, at least they got this right. But nowhere does it say "Hey, we have a maximum limit of 32 characters because we don't value your security". There is no reason to have a max-limit on a password-length in the first place if everything gets properly hashed anyway.

Not-so fun-fact: Ubisoft Connect, the sad excuse of Ubisofts answer to Steam has a max-character limit of 16. But to be honest such quality is to be expected of Ubisoft.

You can however do even worse. A few months ago I wanted to try out another website . The signup-process itself went smooth, however when I wanted to login into the website from another device it didn't accept my in Bitwarden saved password. Through some extensive trial-and-error I figured out that the website allows you to enter as many characters as you want but only saves the first 64.

- It shows you all 128 characters
- It accepts all 128 characters
- Nowhere does it say anything about a max-length

But:

- It only uses the first 64 characters to create the actual password for the account

_Note:_ You want to reset your password and the website sends your old passwort to you in plain-text? Congratulations, the website stores your password in plain-text. You better look for alternatives.

Honestly I struggle to even comprehend on how they managed to mess up this badly when creating the website but it wasn't my problem anymore as I instantly closed and deleted my account again.

Both examples do not offer any way of 2FA.

These are just two examples of bad ways to deal with passwords, and I am sure there are hundreds more. In this day and age security on the internet is more important than ever and not allowing the user to create a secure password is just not ok. My own rules for a good password-field are:

- Minimum length of 16 characters
- Mimimum amount of letters, numbers and special characters
- Allow the user to enable 2FA
- List all rules for passwords clearly under the password-field and notify the user which rule they did not follow when leaving the field.
- Properly hash the password, [do not store it in plain-text](https://plaintextoffenders.com/) and use [salt](<https://www.wikiwand.com/en/Salt_(cryptography)>) and [pepper](<https://www.wikiwand.com/en/Pepper_(cryptography)>)

With this rules in place you can at least somewhat guarranty the safety of the user. You of course cannot protect against stupid users who re-use passwords, [store them themselve in plain-text](https://mashable.com/article/hawaii-post-it-note-password-photo-missile-false-alarm) or just straight up tell it someone else, but you did what you could.
