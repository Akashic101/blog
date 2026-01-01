---
layout: layouts/blog.njk
title: Track and display uptime of your blog
author: David Moll
date: 2024-01-21
tags:
  - posts
  - selfhosting
description: How you can track and display the uptime of your eleventy-page using Uptime Kuma
socialMediaPreviewImage: /images/5eacc38292969a9ea2a6aaaeb2b6babe.png
---

When selfhosting a service like I am with doing with this blog it is always a badge of pride having a 100% uptime. Achieving this is one thing, displays it is another. In this post I will show how you can display your uptime as well using a free selfhosted serice called [Uptime Kuma](https://github.com/louislam/uptime-kuma)

## Setting up Uptime Kuma

Ideally you should host Uptime Kuma on different hardware than your blog. If you host it on the same hardware you cannot track the uptime if both services are down. In my case I had a second Raspberry Pi which I installed this service on. The steps on how to initially setup the Pi are not covered here, I however briefly explained the basics in [this article](/blog/2024-01-14-How-to-host-a-blog).

## Docker-Compose

Uptime Kuma is really easy to setup with Docker and Docker-Compose. Installing those two services is different depending on where you are hosting Uptime Kuma, for me I followed the official documentation on the [Docker-Website for Debian](https://docs.docker.com/engine/install/debian/) since I am running Raspberry Pi OS 64bit and [these instructions](https://thelinuxcode.com/install-docker-compose-raspberry-pi/) to setup Docker-Compose. The `docker-compose.yml` looks like this:

```yml:docker-compose.yml

version: '3'

services:
  uptime-kuma:
    image: louislam/uptime-kuma:latest
    container_name: uptime-kuma
    restart: always
    ports:
      - "3001:3001"
    volumes:
      - Uptime Kuma:/app/data

volumes:
  uptime-kuma:
```

## Uptime-Kuma-Web-API

### Installation

Now you can nagivate to the website, create a user and add a monitor for your blog. I decided on a simple HTTP(S)-monitor with a heartbeat interval of 30 seconds, but those settings are up to you. One great feature Uptime Kuma also offers is notifications when a service goes down, another reason why you should host Uptime Kuma on different hardware than your blog so you can get notifications if something happens. With that done we can go over to the next step which is setting up the API.

At the current date the API for Uptime Kuma doesn't really exist. You can generate an API-key but not really do anything with it. Luckily the community is already a step ahead and created a [Python-API](https://github.com/lucasheld/uptime-kuma-api) for Uptime Kuma and also a [Web-API](https://github.com/MedAziz11/Uptime-Kuma-Web-API) which we will use to get the data we will need. Setting up the Web-API is pretty straight forward, all we need is to expand the above `docker-compose.yml` a bit.

**Important:** You need to first run just Uptime Kuma and create a user and password or else you cannot authenticate yourself with the API

```yml:docker-compose.yml

version: '3'

services:
  uptime-kuma:
    image: louislam/uptime-kuma:latest
    container_name: uptime-kuma
    restart: always
    ports:
      - "3001:3001"
    volumes:
      - uptime-kuma:/app/data

  api:
    container_name: backend
    image: medaziz11/uptimekuma_restapi
    volumes:
      - api:/db
    restart: always
    environment:
      - KUMA_SERVER=IP.of.uptime.kuma:3001
      - KUMA_USERNAME=username
      - KUMA_PASSWORD=password
      - ADMIN_PASSWORD=password
    depends_on:
      - uptime-kuma
    ports:
      - "8000:8000"

volumes:
  uptime-kuma:
  api:
```

Change the environment-variables and also the port if needed, then run `docker-compose up -d` again to run both services together.

### Authentication

Navigate to the Web-API and scroll all the way down to `/login/access-token`. Next click on "try it out" and fill out the username and password.

**Important:** Your admin-username is always "admin".

Click on "execute" and if everything worked you will see in the server-response the access-token which we will need. Copy the string and we are ready to send authenticated requests to the API. You can also login in the Web-API by clicking on "Authorize" on the top right, filling in your username `admin`, password and under `client secret` the token we just generated. That way we can use the Web-API directly to explore all the endpoints and see what data we get back.

### Eleventy

In your `_data`-directory create a new file, I called it `uptime.js`, then paste following code into the file:

```js:uptime.js
{% raw %}
require('dotenv').config();

module.exports = async () => {
    const url = 'IP.of.uptime.kuma.web.api:8000/uptime'; // Adjust this to the URL of Uptime-Kuma-Web-Api
    const headers = {
        'accept': 'application/json',
        'Authorization': `Bearer ${process.env.BEARER_TOKEN}`
    };

    try {
        // Use dynamic import for 'node-fetch'
        const fetch = (await import('node-fetch')).default;

        const response = await fetch(url, { method: 'GET', headers: headers });
        const data = await response.json();

        const dayUptime = calculateTotalUptime(data, 24);  // 24 hours for a day
        const monthUptime = calculateTotalUptime(data, 720);  // 720 hours for a month

        return {
            day: {
                raw: dayUptime,
                formatted: (dayUptime * 100).toFixed(2)
            },
            month: {
                raw: monthUptime,
                formatted: (monthUptime * 100).toFixed(2)
            }
        };
    } catch (error) {
        console.error('Error:', error.message);
    }
};

function calculateTotalUptime(data, durationThreshold) {
    const filteredData = data.filter(record => record.duration === durationThreshold);
    const totalUptime = filteredData.reduce((sum, record) => sum + record.uptime, 0);
    return totalUptime;
}

module.exports();{% endraw %}
```

Make sure to also install dotenv with `npm install --save-dev dotenv` since we will safe the authentication-token inside an `.env`-file to keep it save. For this create a file called `.env` in the root of your directoy and write `BEARER_TOKEN=your.authentication-token`[^1] in it. Also install `node-fetch` with `npm install --save-dev node-fetch`, we will need this package to send requests to the Web-API.

Now you can access the generated data anywhere, for example I display the uptime for each day and month on my [stats-page](/stats). For this I add following elements to the table:

```html:stats.njk
{% raw %}
<tr>
    <td>Uptime (day)</td>
    <td>{{ uptime.day.formatted }}%</td>
</tr>
<tr>
    <td>Uptime (month)</td>
    <td>{{ uptime.month.formatted }}%</td>
</tr>{% endraw %}
```

Now of course since Eleventy generates static websites this data won't change unless we update it by rebuilding the website. To solve this I added `0 0 * * * cd blog && sudo npx @11ty/eleventy` to the crontab on my Pi. With this the website will be rebuild once per day at midnight to show the new data.

And thats it, now your uptime gets accurately tracked and displayed in your blog. The Uptime-Kuma-Web-API also offers endpoints to track for example the average ping of the website you are tracking, planned maintenances and more to display if you want to. I'd love to see your implementation of Uptime Kuma so feel free to share them with me.

## Footnotes

[^1]: The authentication-token will change whenever the monitor changes (and possibly the service restarts). You will have to reauthenticate when this happens and update the token in the `.env`-file. If you have any idea on how to automate this please let me know.
