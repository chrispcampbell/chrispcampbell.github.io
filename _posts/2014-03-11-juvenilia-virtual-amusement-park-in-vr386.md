---
layout: post
title:  "Juvenilia: Virtual Amusement Park in VR386"
date:   2014-03-11 07:07:29 -0800
tags:   [code]
---
[Short version: I recently came across the intentionally awful
[Really3D](https://www.youtube.com/user/really3d) channel (check out
[their version](https://www.youtube.com/watch?v=W5YhguVao0U&list=TLQVjiq8GDBPdFNnAmlS8Syhi0XhRhqVTS)
of The Simpsons intro, for example) and it reminded me of the
unintentionally primitive virtual reality programming I did as a
teenager.
I managed to revive some of that work and made the following video
([YouTube link](https://youtu.be/Owh3eOKZPYs)).
If you care to read some of the back story, there’s more after the embed.]

<div class="video-container">
<iframe class="video-embed" width="560" height="315" src="https://youtube.com/embed/Owh3eOKZPYs" frameborder="0" allowfullscreen></iframe>
</div>

Back in the early 1990s, long before the much-anticipated Oculus Rift
HMD or even the much-maligned
[VRML](https://en.wikipedia.org/wiki/VRML) web standard, there was a small
group of academics building virtual reality software that could be
run on average consumer PCs.
Bernie Roehl and Dave Stampe created one such DOS program,
[REND386](https://ece.uwaterloo.ca/~broehl/rend386.html),
that later evolved into Roehl’s
[AVRIL](https://ece.uwaterloo.ca/~broehl/avril.html) and Stampe’s
[VR386](https://groups.google.com/forum/#!topic/sci.virtual-worlds/8aQEu-WiknI).

As a geeky teenager with an interest in all things graphics, I was
fascinated that I could run these programs on our home PC (i486 if
memory serves), trying out all kinds of virtual “worlds” — often not
much more than a few small 3D models — submitted by average users
on the newsgroups. I cut my teeth on 3D graphics programming and
animation using REND386 and VR386 and learned a whole lot about
the joys of basic linear algebra along the way.

Even cooler was that VR386 had support for navigating worlds and
manipulating objects using my dust-gathering Nintendo
[Power Glove](https://en.wikipedia.org/wiki/Power_Glove) via an
inexpensive homebrew serial connection kit that I was able to
afford with monies from my part-time dishwashing job. (Yes,
the Power Glove finally had a valid use case other than beating
Glass Joe in less than 27 seconds. Or serving as a
[meme/punchline](https://youtube.com/watch?v=KZErvASwdlU).)

I think I was around 13 when I tried creating my first virtual world
for REND386: an AC/DC concert (modeled after my favorite
“Live at Donington” VHS tape that had probably already been worn out
by that time from being played and rewound endlessly).
I remember there being a golem-like Brian Johnson, riding a crude 3D
model of the “Hell’s Bells” bell, and a duck-walking Angus Young.
I’m sure it would be both hilarious and cringe-worthy had it survived,
but unless it’s bit-rusting in my parents’ basement, I think it’s
been lost to the ages.

Fortunately, thanks to the magic of various archive mirrors
(and VirtualBox!) I was able to locate and revive the one project I
was relatively proud of: DZZYLAND.
Some time in late 1994 or early 1995 I met some like-minded VR hobbyists
via Usenet and AOL, and we had the idea of collaborating on a whole
virtual amusement park built in VR386.
As a young kid, my family spent way too much time at the Dutchess
County Fair every summer, and I’d often draw pictures or build models
of midway rides, presumably to mask the depression I encountered after
the fair closed up shop for the year.
So I got pretty excited at the prospect of building ride models with
something other than drinking straws.

I think I used some sort of shareware CAD program to build 3D models
and then cobbled them together (think duct tape) with a text editor,
painstakingly tweaking coordinates and adjusting transforms and animation
parameters in what must have been an awfully mind-numbing edit/compile/test
cycle.
I ended up building three rides from memory: the
Orbiter ([Wikipedia](https://en.wikipedia.org/wiki/Orbiter_(ride)),
[YouTube](https://www.youtube.com/watch?v=o4_u_EvAmlg)),
the Rainbow ([Wikipedia](https://en.wikipedia.org/wiki/Rainbow_(ride)),
[YouTube](https://www.youtube.com/watch?v=QyIAJ_U4gvw)),
and a Log Flume ride ([Wikipedia](https://en.wikipedia.org/wiki/Log_flume_(ride)),
[YouTube](https://www.youtube.com/watch?v=o7oysK-Jr5U)).
Other people in our so-called “AOL Community World Builders” group, or
CommWld’ers for short, were responsible for the other rides and buildings,
such as the gondola, swings, and hot dog (?) stand.

The results in the video above speak for themselves: pretty amateurish,
but also pretty impressive that it could all be built with free software
by average (non-)developers in a friendly, collaborative, open-source-like
development team.
I just remembered that we even received an award for DZZYLAND from VRASP
(Virtual Reality Alliance of Students and Professionals), which at the time
felt like an honor (but considering that I can find no mention of the award
on the web, or much information about VRASP for that matter, it’s not like
we won an Academy Award or anything).
In later years I realized that it was actually a pretty unique character-building
experience, where people 2 or 3 or 5 times my age, whom I had never met in
person, were willing to go along with my ideas and be constructive and nice
and helpful and never once condescending along the way.

For the sake of posterity (or if you’re interested in stepping into a time
machine back to 1995), I’ve gathered some links and resources that I used
to make the above video and to refresh my fuzzy memory.

[wlds.txt](https://www.ibiblio.org/pub/academic/computer-science/virtual-reality/rend386/worlds/wlds.txt)
([local mirror](/files/dzzyland/wlds.txt))
<br/>
Some sort of index of various REND386/VR386 world files; one of the only places
I was able to find mention of the AOL CommWld project.

[dzzyland.zip](ftp://ftp.ibiblio.org/pub/academic/computer-science/virtual-reality/rend386/worlds/dzzyland.zip)
([local mirror](/files/dzzyland/dzzyland.zip))
<br/>
A zip file containing the DZZYLAND “source” files.

[vr386.zip](ftp://ftp.pgp.net/pub/sci/virtual-reality/software/vr386/vr386.zip)
<br/>
A VR386 source/binary distribution for DOS circa late 1994.

[dos-vm-with-dzzyland.zip](https://www.dropbox.com/s/td8zmuwsizpswkr/dos-vm-with-dzzyland.zip?dl=0)
<br/>
A zip file containing a VirtualBox VM running DOS 6.22 (I created it using these
instructions) along with VR386 and the requisite DZZYLAND files unpacked in
`c:\vr386`; assuming you can get the VM running, you can launch DZZYLAND simply
by typing “go” at the `c:` prompt.
