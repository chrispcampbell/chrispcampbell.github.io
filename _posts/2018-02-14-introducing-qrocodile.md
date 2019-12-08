---
layout: post
title:  "qrocodile: A Kid-friendly Sonos Controller"
date:   2018-02-14 17:27:40 -0800
tags:   [code]
---
It all started one night at the dinner table over winter break.
The kids wanted to put an album on the turntable (hooked up to
the line-in on a Sonos PLAY:5 in the dining room).
They’re perfectly capable of putting vinyl on the turntable all
by themselves, but using the Sonos app to switch over to play
from the line-in is a different story.

I was lamenting aloud the number of steps it takes, and then my
brain got started pondering solutions.
Take off my tin foil hat and give in to the Alexa craze?
Buy some sort of IoT button thing?
An RFID tag thing? QR codes maybe?
The latter option got me thinking of all kinds of possibilities.
Maybe the kids could choose dinner music from any number of
songs/albums (from Spotify or my local collection) just by
waving a QR code in front of something.
Or maybe now they could build their own dance party playlists.

It seemed like a fun thing to explore, so I ordered a Raspberry
Pi and a cheap camera.
The next day it arrived and the hacking began.
This was a fun little (multi-)weekend project.
What started as “make the simplest possible thing to switch to
line-in” quickly led to all kinds of unexpected diversions.
Eventually we ended up with something called `qrocodile`,
which can be best summarized as a kid-friendly system for
controlling Sonos using cards imprinted with QR codes.

<div style="display: block; margin-left: auto; margin-right: auto; width: 655px;">
<p>
<a href="https://www.flickr.com/photos/chrispcampbell/38677871980/in/album-72157693866089215/">
  <img style="float: left; display: inline-block; margin-right: 15px;" src="https://live.staticflickr.com/4653/38677871980_ce4b8b8c6e_n.jpg" alt="qrocodile1" width="320" height="213" />
</a>
</p>
<p>
<a href="https://www.flickr.com/photos/chrispcampbell/25617161267/in/album-72157693866089215/">
  <img style="float: left; display: inline-block;" src="https://live.staticflickr.com/4651/25617161267_c2621cca3f_n.jpg" alt="qrocodile2" width="320" height="213" />
</a>
</p>
</div>
<p><br style="clear: both;"/></p>
<br/>

I made a video to demonstrate how `qrocodile` works and to
give a brief glimpse of what it took to put the (physical)
pieces together:

<center><iframe style="margin-bottom: 20px;" src="https://www.youtube.com/embed/yjEDAvP4rCc?rel=0&amp;showinfo=0" width="560" height="315" frameborder="0" allowfullscreen="allowfullscreen"></iframe></center>
<br/>

The [source code](https://github.com/chrispcampbell/qrocodile)
is available on GitHub along with a fair amount of technical
documentation.

It’s been interesting seeing the kids putting the thing through
its paces during their frequent “dance parties”, queuing up
their favorite songs and uncovering new ones.
I really like that they can use tangible objects to discover
music in much the same way I did when I was their age, looking
through my parents records, seeing which ones had interesting
artwork or reading the song titles on the back, listening and
exploring. 
That sort of experience has nearly disappeared in the age of
music streaming and digital music libraries.
(I’ve got a fair amount of vinyl, but 10 times that amount in
a digital music library ripped from CDs, so this has been a
nice way to expose songs that might otherwise be hidden somewhere
on a hard drive.)

This system has a number of advantages over voice assistants like
Alexa.
My kids don’t often know the proper name of a song and wouldn’t
necessarily think to request a certain song, but if they see a
stack of cards on the table, they can recognize a band’s name
or an album cover by sight and build up a whole queue of songs
simply by stacking and organizing their cards.
It’s fun to watch, and I hope this project inspires you to
introduce this sort of physical computing into your own home.
