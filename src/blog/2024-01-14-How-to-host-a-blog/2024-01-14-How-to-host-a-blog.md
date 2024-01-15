---
layout: blogLayout.njk
title: How to host a 11ty-site on a Raspberry Pi
author: David Moll
date: 2024-01-14
tags: 
- posts
- selfhosting
description: How I am hosting my blog on a Raspberry Pi for almost no money
folderName: 2024-01-14-How-to-host-a-blog
socialMediaPreviewImage: https://blog.davidmoll.net/assets/images/2024-01-14-How-to-host-a-blog/cover.png
socialMediaPreviewImageAlt: A cat looking at a motherboard
hasCode: true
---

![{{ socialMediaPreviewImageAlt }}]({{ socialMediaPreviewImage }})

Starting now my blog has reached version 1.0.0 with it now being hosted on my Raspberry Pi 4B, hopefully with no down-time. In the following post I will explain how I achieved this with minimal costs and how you can do it too.

## Hardware

As mentioned you are reading this blog on a Raspberry Pi 4B. This website can probably run on even weaker hardware like a Raspberry Pi Zero which you can buy for just 10-20€ or so but since I already had a 4B on-site which was gathering dust I figured why not use it for this project. My Pi 4B is also upgraded with a Power over Ethernet (PoE+) HAT, enabling me to run the Pi with just a single cable and a router/switch which supports POE. I have a TL-SG108PE which has four ports with and four ports without POE so this covers my needs.

<table>
  <thead>
    <tr>
      <th>Hardware</th>
      <th>Costs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Raspberry Pi 4B</td>
      <td>60€</td>
    </tr>
    <tr>
      <td>Raspberry Pi PoE+ HAT (optional)</td>
      <td>21,90€</td>
    </tr>
    <tr>
      <td>TP-Link TL-SG108PE (optional)</td>
      <td>51€</td>
    </tr>
  </tbody>
</table>

*All prices are the lowest found for each object using [Geizhals.de](https://geizhals.de/)*

## Domain

Years ago I bought a domain using Namecheap, one of many domain-providers. This costs me per year just 13,85€. I could buy additional add-ons that Namecheap provides but I don't need any of them so my costs stay very low.

## Tunneling

A tunnel, in the context of networking and technology, refers to a secure and private communication channel established over a public network. The purpose of creating a tunnel is to encapsulate data and protect it as it traverses the less secure or public portions of the network. While there are many services that provide free tunnels, I deciced to use [Zero-Trust Cloudflare Tunnel ](https://www.cloudflare.com/products/tunnel/) since its free, easy to setup and does all that I need it to do with no hassle.

## Setting everything up

### Raspberry Pi OS

First step is to use the [Raspberry Pi Imager](https://www.raspberrypi.com/software/) to flash Raspberry Pi OS on a Micro-SD Card. I specifically decided to use Raspberry Pi OS Lite (64-bit) since I dont need a desktop environment.

**Tipp:** With Raspberry Pi Imager open press Ctrl+Shift+X to open the settings. There I enabled SSH, setup a password and disabled telemetry.

After inserting the Micro-SD Card into the Pi and booting it up by connecting the POE-Ethernet cable to the port I used [Advanced IP Scanner](https://www.advanced-ip-scanner.com/) to find out the assigned internal IP of my Pi. Then I used [PuTTY](https://putty.org/) to connect to the Pi using SSH. I chose Cyberduck speficially since its [completely Open-Source](https://github.com/iterate-ch/cyberduck).

After the connection was established I made sure all software on the Pi is up-to-date using `sudo apt update`, `sudo apt upgrade` followed by a reboot with `sudo reboot`.

### NodeJS

To run the blog itself I need to install NodeJS which is an open-source JavaScript runtime environment. To install it on the Pi you can use following commands:

`curl -sL https://deb.nodesource.com/setup_18.x | sudo bash -` (This downloads NodeJS v18 which is the recommended version)

`sudo apt install nodejs` This commands installs NodeJS

Now you can check if the install worked with `node --version` which prints out the installed version.

### Git

Git is the go-to version control system of basically everyone which I use to track my changes on this blog. It isn't installed by default on Raspberry Pi OS but you can install it really easily with `sudo apt install git`.

After that you can clone the repository using `git clone https://github.com/Akashic101/blog.git` which downloads the repo to `/blog`.

### NVM (optional)

NVM is a Node Version Manager which I am using to make sure that I can quickly and easily switch the version of Node that I am using. To install it run

```bash
cd ~

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

command -v nvm
```

Now that NVM is installed you can navigate to the blog-repo and install the correct Node-version with:

```bash
nvm install v18.16.1

nvm use
```

### NPM

To download all dependencies that I need I run `npm ci`, that's all that is needed.

### Cloudflare Tunnel

If I want to easily and securely access my internal network from everywhere with a domain I use Cloudflare Tunnel. Before this you need to make sure your domain is linked to Cloudflare, this however is different for everyone depending on the domain-provider you are using. The steps to do this won't be covered here, you can find all information you need on Cloudflare's website.

One the Cloudflare Dashboard navigate to Access > Tunnels. There create a new tunnel, give it a name and choose the environment you want to install Cloudflare Tunnels in. In my case I am using Debian arm64-bit. This will generate some commands at the bottom of the page, copy those and paste them into the terminal of your Pi. Now run `cloudflared tunnel login` to authenticate your tunnel and navigate after this back to the Tunnels-page on Cloudflare. Click on the tunnel you created, then "configure" followed by "Public Hostname". Add a public hostname, give it an optional subdomain ("blog" in my case) followed by the linked domain. Under Service choose HTTP with the URL of the service you are running. The URL will be by default with eleventy `localhost:8080`. Hit "save hostname" and you are done.

### Eleventy

The last step is to create a daemon that will auto-start eleventy even after a shutdown, restart or crash. To do this run `sudo nano /etc/systemd/system/eleventy.service` and enter following text in the file:

```bash
[Unit]
Description=Eleventy Static Site Generator

[Service]
Type=simple
ExecStart=npx @11ty/eleventy --serve
WorkingDirectory=/path/to/your/project

[Install]
WantedBy=default.target
```

You can get the full path by navigating into the folder you need the path for and entering `pwd`.

Now to reload systemd and start the service save and close the file and enter 

```bash
sudo systemctl daemon-reload
sudo systemctl start eleventy
sudo systemctl enable eleventy
```

in the Terminal. This will reload all services, start eleventy and enable it to start on boot. If you want to see if everything worked you can enter `sudo journalctl -u eleventy` to see the logs.

### Updates

To update your blog with new content you can update the repo by navigating into it and entering `git pull` followed by `sudo systemctl start eleventy`. That command will build the static files with the new files and start the daemon again.

---

That's it, now you have a blog that runs on cheap hardware forever as long as the Pi has power and internet. If you have any notes on how to improve this service please leave them in the comments.