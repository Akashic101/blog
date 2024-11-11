---
layout: blog.njk
title: Analyzing the results of the 8th Martinslauf Paderborn using Python
author: David Moll
date: 2024-11-09
tags:
  - posts
  - development
  - python
  - data-visualization
description: Taking a closer look at the results of 10km I participated in using Python and fancy plots
folderName: 2024-11-09-Analyzing-the-results-of-the-8th-Martinslauf-Paderborn-using-Python
socialMediaPreviewImage: https://blog.davidmoll.net/assets/images/2024-11-09-Analyzing-the-results-of-the-8th-Martinslauf-Paderborn-using-Python/cover.png
socialMediaPreviewImageAlt: An image of the author with his trophy after the race
hasCode: true
credits: true
---

![{{ socialMediaPreviewImageAlt }}]({{ socialMediaPreviewImage }})

## Opening

Paderborn, my hometown, has three big races, the Osterlauf, the Martinslauf and the BobbahnRun. Yesterday it was once again time for the Martinslauf, a yearly run on the Friday before the St. Martin's Day. I participated this year for the first time in the 10km-run (last year I took part in the 6k) and managed to beat [my target of < 1 hour](https://www.strava.com/activities/12854554602). I also took the opportunity to learn how to visualize data in nice looking plots using Python which this blog will be about. As a warning, Python is anything but my strongpoint and I am very much still a beginner so ChatGPT had to do quite some lifting, if there are any mistakes in the code or improvements please let me know :) You can find the entire code of the project here: [https://github.com/Akashic101/8.-Martinslauf-Paderborn](https://github.com/Akashic101/8.-Martinslauf-Paderborn)

## Getting the data

This race using Davengo as a registration- and tracking-platform which makes it really easy to get my hands on the official result in a way that fits my goal well. While there is an offical results-list available on the [official website](https://www.davengo.com/event/result/8-paderborner-martinslauf-2024/) I wanted to get the data into a database for easier querying. For that I had a look at the network-requests going out from Firefox and quickly found the correct one that supplies the result . From there I exported the request as a cUrl-adress, imported it into Postman and had a look at it there. The request was a POST with following body

```json:body

{ "type": "simple", "term": null, "category": "10km Autohaus Krenz Lauf", "offset": 0 }
```

And the response I get back looks like this

```json:response

{
    "mode": "single",
    "navigation": {
        "nextOffset": 125
    },
    "fields": [
        {
            "textAlignment": "LEFT",
            "id": "rankTotal",
            "title": "Platz",
            "priority": false
        },
        {
            "textAlignment": "LEFT",
            "id": "rankMale",
            "title": "M",
            "priority": true
        },
        {
            "textAlignment": "LEFT",
            "id": "rankFemale",
            "title": "W",
            "priority": true
        },
        {
            "textAlignment": "LEFT",
            "id": "startNo",
            "title": "Nr.",
            "priority": true
        },
        {
            "textAlignment": "LEFT",
            "id": "firstName",
            "title": "Vorname",
            "priority": true
        },
        {
            "textAlignment": "LEFT",
            "id": "lastName",
            "title": "Nachname",
            "priority": true
        },
        {
            "textAlignment": "LEFT",
            "id": "rankAgeGroup",
            "title": "AK-Platz",
            "priority": false
        },
        {
            "textAlignment": "LEFT",
            "id": "ageGroupShort",
            "title": "AK",
            "priority": false
        },
        {
            "textAlignment": "LEFT",
            "id": "teamName",
            "title": "Verein",
            "priority": true
        },
        {
            "textAlignment": "RIGHT",
            "id": "nettoTime",
            "title": "Zeit",
            "priority": true
        }
    ],
    "results": [
        {
            "teamName": "",
            "firstName": "firstName",
            "lastName": "lastName",
            "ageGroupShort": "MHK",
            "nettoTime": "00:34:30",
            "rankMale": "1.",
            "startNo": 693,
            "combined": "1_15_1",
            "rankTotal": "1.",
            "rankFemale": null,
            "hash": "trxfwv-z-svW_FOHXv2saCxczbIgiJOD-OTb6adVquQ",
            "rankAgeGroup": "1."
        },
        ...
    ]
}
```

This format makes it really easy to get the data I need, with a simple JS-script I was able to gather all of the results-array and plug it into a DB using [better-sqlite3](https://www.npmjs.com/package/better-sqlite3). This script can be found at [https://github.com/Akashic101/8.-Martinslauf-Paderborn/blob/master/resultParser.js](https://github.com/Akashic101/8.-Martinslauf-Paderborn/blob/master/resultParser.js). One interesting catch is that on the last request where there is less than 125 results the response changes slightly and emits

```json: reponse
    "navigation": {
        "nextOffset": 125
    },
```

from the response which caught me off-guard for a bit until I noticed this.

## Visualizing the data using Python

Now that I have a SQLite DB with all the data we can get started with visualizing the data using Python. If you want to follow along I left detailed instructions on how to get everything running in the README of the repo for this blog which hosts all scripts and images. You can find it [here](https://github.com/Akashic101/8.-Martinslauf-Paderborn)

### Scatter-Plot

A scatter plot is a type of plot or mathematical diagram using Cartesian coordinates to display values for typically two variables for a set of data[^1]. With this type of plot I can generate an image showing the overall finishing-times of every runner. The SQL-query for this looks like this

```sql:SQL

SELECT nettoTime, rankTotal
FROM results
```

which when formatted correctly results in this:

<img src="https://raw.githubusercontent.com/Akashic101/8.-Martinslauf-Paderborn/refs/heads/master/results/scatter_plot.png" alt="A scatter-plot comparing the total tank vs netto time" width=800>

An interesting note on this graph is that the shape would be very similar no matter which run you plot, as long as there is a large enough amount of data. This very clearly shows that most runners run the 10km between 00:40:00 and 01:05:00, below and above that the times spread out much more to the extreme. With my time being 00:57:09 I am on the lower end of the average, however one important thing to remember is that with the run being 10km it is already a length that many cannot run at all. If you see your own time in this area do not get discouraged, you are still faster than anyone else that doesn't run at all. It doesn't matter how fast or long you run, it matters THAT you run!

### Circular Bar-Plot

Let's take a look at the participants and in what age-group each ran. When you sign up to such an event you get automatically grouped in an age-group based on your date of birth. I am in the MHK (Männliche Hauptklasse / Male main class) which is for everyone from age 20-29. This class makes up the bulk of both male (97/405) and female (90/231). The SQL-query looks like this:

```sql:SQL

SELECT
    ageGroupShort,
    COUNT(*) AS runnerCount
FROM
    results
WHERE
    ageGroupShort IS NOT NULL
GROUP BY
    ageGroupShort
ORDER BY
    runnerCount DESC;
```

<div align="center">
<img src="https://raw.githubusercontent.com/Akashic101/8.-Martinslauf-Paderborn/refs/heads/master/results/circular_bar_men.png" alt="A circular bar-plot of all men showing their age-group" width=300>
<img src="https://raw.githubusercontent.com/Akashic101/8.-Martinslauf-Paderborn/refs/heads/master/results/circular_bar_women.png" alt="A circular bar-plot of all women showing their age-group" width=300>
</div>

This graph nicely shows how most runners where in the younger phase of their life with just three classes (MHK/M30/M45) making up 249/405 (61,48 %) of all male runners.

There where only four age-groups who only had a single participant, that being M70, M75, W65 and WJ U14 (Women under 14), their times will be easily visible in the next graph.

### Box Plot

A box plot is a graphical representation used to show the distribution, spread, and skewness of numerical data by dividing it into quartiles.[^2] In addition to the central box, a box plot often features lines known as whiskers, which extend from the box to display variability beyond the upper and lower quartiles. This is why it is sometimes referred to as a box-and-whisker plot or box-and-whisker diagram. Outliers, which are values significantly different from the rest of the data,[^3] may appear as individual points located outside the whiskers.

<img src="https://raw.githubusercontent.com/Akashic101/8.-Martinslauf-Paderborn/refs/heads/master/results/box_plot.png" alt="A box-plot showing the times of all participants grouped their age-class" width=800>

_Side-Note: This is by far my favourite graph, so much info in such a neat and tidy way to present it, you cannot not love it_

To explain this box plot a bit more, the main box shows the times between the first quartile (25%) and the third quartile (75%). The orange line represents the median, which is the value in the middle of all the values when they’re ordered. The whiskers display the minimum (the fastest time) and the maximum (the slowest time) within the range of 1.5x the IQR from the quartiles.

The IQR (Interquartile Range) is the distance between the first quartile (Q1) and the third quartile (Q3). So, if for example, Q1 is 100s and Q3 is 200s, the lower whisker would extend to $Q1 - 1.5 * IQR = 100 - 1.5 * 100 = -50$, and the upper whisker would extend to $Q3 + 1.5 * IQR = 200 + 1.5 * 100 = 350$. If a value is outside this range (e.g., less than -50 or greater than 350), it will be marked as an outlier with a red dot.

Outliers are times that fall outside the whiskers, specifically 1.5 times the IQR below Q1 or above Q3. These values are marked as red dots in the box plot.

Let's have a look at the only time that was so fast it is marked as an outlier. The fastest women of the entire race was in the W30-class and ran a 00:39:40, putting her into 16th place overall. Her lap-times, each 2km long, where:

| Lap | Time     |
| --- | -------- |
| 1   | 00:07:45 |
| 2   | 00:07:57 |
| 3   | 00:08:06 |
| 4   | 00:08:02 |
| 5   | 00:07:53 |

### Diverging Plot

This last plot focuses on the teams. Each runner could note down a team during sign-up which 194/636 (30,50%) did. The SQL-query looks like this:

```sql:SQL

SELECT
    teamName,
    COUNT(*) AS runnerCount,
    COUNT(CASE WHEN rankMale IS NOT NULL THEN 1 END) AS maleCount,
    COUNT(CASE WHEN rankFemale IS NOT NULL THEN 1 END) AS femaleCount
FROM
    results
WHERE
    teamName != ''
GROUP BY
    teamName
ORDER BY
    runnerCount DESC, maleCount DESC;
```

Let's take a look how those teams were set up:

<img src="https://raw.githubusercontent.com/Akashic101/8.-Martinslauf-Paderborn/refs/heads/master/results/diverging_plot_teams.png" alt="A diverging plot showing the set-up of each teams and how many men and women where in each" width=300>

The biggest team was TSV Schloss Neuhaus with nine members, of which seven where male and two female. Team VfB Salzkotten is not only the team with the most women but also the biggest team with no men in it at all. Team SC Borchen is their counterpark with seven men and no women in their team. 75 teams had only one member, making up 38,66% of all teams. Four teams had more than five members, here is the list of them and their calculated average from their combined times:

| Lap                      | Time     |
| ------------------------ | -------- |
| ASG Teutoburger Wald     | 00:45:33 |
| Teilzeitläufer Bielefeld | 00:41:57 |
| SC Borchen               | 00:50:52 |
| TSV Schloss Neuhaus      | 00:52:16 |

---

## Closing remarks

If you made it this far I want to thank you for reading this little experiment with python and data-visualization. Perhaps you felt inspired into making something similar, please let me know if you do, I'd love to see your results. This was also the first blog-post I have written using [11ty 3.0.0](https://www.11ty.dev/blog/eleventy-v3/) which went super well with the upgrade and also the first which utilizes [KaTeX](https://katex.org/). I wanted to add math typesetting for a while but never found a solution that I really liked until now.

## Footnotes

[^1]: Utts, Jessica M. Seeing Through Statistics 3rd Edition, Thomson Brooks/Cole, 2005, pp 166-167. ISBN 0-534-39402-7

[^2]: C., Dutoit, S. H. (2012). [Graphical exploratory data analysis](http://worldcat.org/oclc/1019645745). Springer. ISBN 978-1-4612-9371-2. OCLC [1019645745](https://dx.doi.org/10.1080/00401706.1969.10490657).

[^3]: Grubbs, Frank E. (February 1969). "[Procedures for Detecting Outlying Observations in Samples](http://worldcat.org/oclc/940679163)". Technometrics. 11 (1): 1–21. doi:[10.1080/00401706.1969.10490657](https://doi.org/10.1080%2F00401706.1969.10490657). ISSN [0040-1706](https://search.worldcat.org/de/search?q=n2:0040-1706).
