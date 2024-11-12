[![en](https://img.shields.io/badge/lang-en-red.svg)](https://github.com/CharliVanNood/ProjectSteam/blob/master/README.md)
[![nl](https://img.shields.io/badge/lang-nl-green.svg)](https://github.com/CharliVanNood/ProjectSteam/blob/master/README.nl.md)

# ProjectSteam
ProjectSteam is an application that allows you to play games on as many devices as possible.
Ever has the problem of not being able to play games on a 10 year old smartphone? No?
Well neither do we, so that's why we decided to build a streaming application that still allows you to.
You might be asking yourself, how would you ever play keyboard games on a phone without a bluetooth keyboard?
We came up with the idea of emulating keypressen and input in general, this would mean mapping taps to mouse clicks for example.

# The website
## Short description:
This website uses a combination of HTML, CSS and Javascript, this gives us the needed freedom to be able to make this project possible.
For actually rendering individual pixels it's necessary to use a fast language, javascript is sufficient for this.
It's also quite important to receive live data, this is possible with python but for the limitations of rendering and processing, this wasn't realistic.
This is why we chose to use javascript for the streaming of data over python.

## The Homepage
On the Homepage it's possible to see your playtime and recently played games, and launching them again.

## The Profile Page
On the profile page it's possible to add friends and edit your profile.

## The Search Page
On the search page it's possible to discover new games or play ones you've played previously.

## The Analytics Page
On the analytics page it's possible to see your gaming data, this will give you an idea of playtime and gaming trends.

## Available Pages
- Home
    - Game
- Profile
- Analytics
- Search
    - Game

# The streaming of game footage and user input
## Why nodejs?
For the streaming part of our application we've decided to use NodeJS, This has been chosen cause of the performance benefits over python.
This speed is necessary to keep king low and detail high.
