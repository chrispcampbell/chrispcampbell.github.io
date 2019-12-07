---
layout: page
title: code
permalink: /code/
show-page-title: true
---

### Sloan-o-graph

As I watched my long-time favorite band Sloan on stage in 2014,
I got the idea for an interactive visualization that would help
answer critical questions about the songwriting and backing vocal
relationships in the band.
I threw together some JavaScript and Paper.js as a fun little
brain exercise and out popped the (Chris Murphy approved!)
Sloan-o-graph.
[Read more...](TODO)

### Color/Space

Some time in late 2013 I woke up with a very weak idea of making
a game out of choosing colors: given a color, how quickly could
you figure out the RGB components that make up that color?
I probably should have left it as just that, an idea, but too
late, my curiosity was piqued.
Thus, Color/Space was born, and my comrades were kind enough
to release it under the Plausible name.
[View in App Store...](TODO)

### iPhoto/Lightroom Scripts

When I moved from iPhoto to Lightroom in 2008, I couldn't find
any satisfactory tools for properly migrating my existing library
of photos, so I wrote some scripts to help automate the process.
(AppleScript, Lua, and Perl: oh my.)
[Read more...](TODO)

### Muni Status

One day in mid-2008, I suddenly became frustrated with the
[indecipherable](http://www.flickr.com/photos/chrispcampbell/2573863573/in/set-72157605585682253/)
status displays that are used in the underground Muni stations in
San Francisco.
I went home and spent just a couple hours prototyping a new display
using JavaFX, which uses subtle animations and crisp scalable graphics
to present clear information to Muni patrons.
[Read more...](TODO)

I prototyped a couple different designs. Here is the original one
(even nicer ones followed):

<p style="text-align:center;">
  <a href="http://www.flickr.com/photos/chrispcampbell/sets/72157605585682253/">
    <img id="muni_now" src="http://farm4.static.flickr.com/3125/2574617086_50d5066a1a_z_d.jpg"/>
  </a>
</p>
    
I met with the SFMTA a number of times that year, trying to get them
to realize that it doesn't take much effort to come up with something
better, and that San Francisco is full of designers and developers who
would be glad to donate their time to the project.
My designs made their way around SFMTA, and everyone seemed to like
them, but in the end it turned out that they had already paid some
contractors to design a new status screen that was eventually used
in most stations in 2009
The new design, while an improvement over what we had before, has
lots of problems and is not as usable as it could be.
I regret that I didn't try harder (or get involved sooner), but the
SFMTA is a frustrating bureaucracy and it was apparent that I couldn't
stop a snowball in motion. 

### JavaFX

I spent a couple years working on the [JavaFX](http://javafx.com/) runtime.
I was heavily involved in designing the core scenegraph and animation
packages, the Decora effects framework (see below), and the Prism graphics
engine.
Prism is a small, highly tuned, GPU-accelerated graphics runtime that serves
as the foundation for JavaFX on everything, from desktops on down to phones
and small embedded devices.

The Prism engine was designed to provide high-performance 2D/3D graphics
while also serving as the "heartbeat" for smooth animations in JavaFX.
One cool thing about Prism is that it takes advantage of JSL, the shading
language from the Decora project.
Many graphics primitives in Prism were written in JSL and take advantage
of the GPU whenever possible.

The source code for Prism is available under the OpenJDK project in the
[OpenJFX repositories](http://hg.openjdk.java.net/openjfx/9/rt/). Look
under the `modules/graphics/src/main` tree for the core Prism runtime sources
as well as various platform-specific backends.

<!-- TODO
I also wrote a series of entries on my old java.net blog about using the
effects package in JavaFX: 

    Introduction
    Basics
    Quality
    Chaining 
    -->
    
### Decora
  
TODO  

### Java2D + OpenGL

TODO
