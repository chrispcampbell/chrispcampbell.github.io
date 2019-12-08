---
layout: page
title: code
show_page_title: true
permalink: /code/
redirect_from:
  - /static/code
---

### qrocodile

In early 2018, I created a fun little weekend hack called
`qrocodile`, which is a kid-friendly system for controlling
Sonos with QR codes, built using LEGO and a Raspberry Pi.
The project received a lot of love from the makers of the
Raspberry Pi, who featured it both
[online](https://www.raspberrypi.org/blog/qrocodile-kid-friendly-sonos-system/)
and in [print](https://twitter.com/chrscmpbll/status/979727170133155840).
The instructions and source code are all available on GitHub.
[Read more...](https://github.com/chrispcampbell/qrocodile)

### PLRelational

Back in 2015-16, I developed (with Plausible-alumnus Mike Ash)
a Swift framework called PLRelational.
Basically it's a storage and presentation library based
on relational algebra, that allows you to treat relations
as a reactive stream of values, which can simplify UI programming.
And since 2019, it provides seamless integration with Apple's
SwiftUI and Combine frameworks.
[Read more...](https://github.com/plausiblelabs/plrelational)

### Rust

I really enjoy using the Rust programming language.
I've been a fan since the pre-1.0 days, and at Plausible I've
built a number of interesting libraries in Rust, from a
functional reactive UI toolkit prototype to a combinator-based
codec library.
That toolkit prototype hasn't been open sourced (yet?),
but three other Rust libraries of mine are available on GitHub:
[rcodec](https://github.com/plausiblelabs/rcodec),
[pl-hlist](https://github.com/plausiblelabs/hlist-rs),
and
[pl-lens](https://github.com/plausiblelabs/lens-rs).

### Sloan-o-graph

As I watched my long-time favorite band Sloan on stage in 2014,
I got the idea for an interactive visualization that would help
answer critical questions about the songwriting and backing vocal
relationships in the band.
I threw together some JavaScript and Paper.js as a fun little
brain exercise and out popped the (Chris Murphy approved!)
Sloan-o-graph.
[Read more...](/2014/10/30/sloan-o-graph)

### Color/Space

Some time in late 2013 I woke up with a very weak idea of making
a game out of choosing colors: given a color, how quickly could
you figure out the RGB components that make up that color?
I probably should have left it as just that, an idea, but too
late, my curiosity was piqued.
Thus, Color/Space was born, and my comrades were kind enough
to release it under the Plausible name.
[View in App Store...](https://apps.apple.com/us/app/color-space/id700391511)

### iPhoto/Lightroom Scripts

When I moved from iPhoto to Lightroom in 2008, I couldn't find
any satisfactory tools for properly migrating my existing library
of photos, so I wrote some scripts to help automate the process.
(AppleScript, Lua, and Perl: oh my.)
[Read more...](/2011/04/03/iphoto-to-lightroom-to-flickr-and-beyond)

### Muni Status

One day in mid-2008, I suddenly became frustrated with the
[indecipherable](http://www.flickr.com/photos/chrispcampbell/2573863573/in/set-72157605585682253/)
status displays that are used in the underground Muni stations in
San Francisco.
I went home and spent just a couple hours prototyping a new display
using JavaFX, which uses subtle animations and crisp scalable graphics
to present clear information to Muni patrons.
<a id="muni_reveal" href="javascript:;" onClick="reveal_div('muni');">Read more...</a>

<div id="muni_more" style="display:none;">
  <p>
    I prototyped a couple different designs. Here is the original one
    (even nicer ones followed):
  </p>
  <p style="text-align:center;">
    <a href="http://www.flickr.com/photos/chrispcampbell/sets/72157605585682253/">
      <img id="muni_now" src="http://farm4.static.flickr.com/3125/2574617086_50d5066a1a_z_d.jpg"/>
    </a>
  </p>
  <p>    
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
  </p>
</div>

### JavaFX

I spent a couple years working on the [JavaFX](http://javafx.com/) runtime.
I was heavily involved in designing the core scenegraph and animation
packages, the Decora effects framework (see below), and the Prism graphics
engine.
Prism is a small, highly tuned, GPU-accelerated graphics runtime that serves
as the foundation for JavaFX on everything, from desktops on down to phones
and small embedded devices.
<a id="javafx_reveal" href="javascript:;" onClick="reveal_div('javafx');">Read more...</a>

<div id="javafx_more" style="display:none;">
  <p>
    The Prism engine was designed to provide high-performance 2D/3D graphics
    while also serving as the "heartbeat" for smooth animations in JavaFX.
    One cool thing about Prism is that it takes advantage of JSL, the shading
    language from the Decora project.
    Many graphics primitives in Prism were written in JSL and take advantage
    of the GPU whenever possible.
  </p>
  <p>
    The source code for Prism is available under the OpenJDK project in the
    [OpenJFX repositories](http://hg.openjdk.java.net/openjfx/9/rt/). Look
    under the `modules/graphics/src/main` tree for the core Prism runtime sources
    as well as various platform-specific backends.
  </p>
</div>

<!-- TODO
I also wrote a series of entries on my old java.net blog about using the
effects package in JavaFX: 

    Introduction
    Basics
    Quality
    Chaining 
    -->
    
### Decora

Decora is the pet name of the pixel effects framework that I developed,
which serves as the foundation for the
[`javafx.scene.effect`](http://docs.oracle.com/javase/8/javafx/api)
package in JavaFX.
It provides easy-to-use (Java) classes for commonly used effects, such as
blurs, drop shadows, reflections, color adjustments, displacement mapping,
lighting, and perspective transform.
It was also intended to be extensible, so that savvy developers could provide
their own effects by using a custom language that we developed called JSL
(a shading language not unlike GLSL or HLSL).
<a id="decora_reveal" href="javascript:;" onClick="reveal_div('decora');">Read more...</a>

<div id="decora_more" style="display:none;">
  <p>
    The project contains a custom compiler that I wrote (using
    <a href="http://antlr.org/">ANTLR</a>), which takes JSL programs and compiles
    them down into a number of variants, like a GLSL version for use with the
    OpenGL backend, an HLSL version for use with the Direct3D backend, and a couple
    different software-based implementations (Java, C/SSE) that can run on the CPU
    for cases where a GPU is not available.
  </p>
  <p>
    Although Decora was primarily designed as an implementation detail of the
    overall JavaFX runtime, it was also designed to be toolkit agnostic, meaning
    that it could be used as a standalone library, complementing Java2D and other
    graphics engines.
  </p>
  <p>
    The source code for Decora is available under the OpenJDK project in the
    <a href="http://hg.openjdk.java.net/openjfx/9/rt/">OpenJFX repositories</a>.
    Look under the <code>modules/graphics/src/main</code> tree for the bulk
    of the Decora runtime.  The Decora/JSL compiler sources can be found under
    the <code>buildSrc/src/main</code> tree in the
    <code>com.sun.scenario.effect.compiler</code> package.
  </p>
</div>

### Java2D + OpenGL

Prior to working on JavaFX, I spent 8+ years tuning Sun's implementation
of the Java2D and Image I/O APIs.
I developed the OpenGL-based Java2D pipeline from the ground up (see this
[article](https://web.archive.org/web/20051029000641/http://today.java.net/pub/a/today/2004/11/12/graphics2d.html)
and these two
[blog](https://web.archive.org/web/20050313055345/http://weblogs.java.net/blog/campbell/archive/2005/03/strcrazy_improv_1.html)
[entries](https://web.archive.org/web/20101218110328/http://weblogs.java.net/blog/2005/07/14/str-crazier-performance-improvements-mustang)).
I also implemented a ton of performance optimizations over the years (see
this
[entry](https://web.archive.org/web/20101218103751/http://weblogs.java.net/blog/2006/01/13/400-horsepower-image-io-improvements-mustang)
for just one example).
<a id="java2d_reveal" href="javascript:;" onClick="reveal_div('java2d');">Read more...</a>

<div id="java2d_more" style="display:none;">
  <p>
    The source code for Java2D is available from the
    <a href="http://openjdk.java.net/groups/2d/">OpenJDK</a> project.  You can
    find the sources for the OpenGL pipeline in the
    <a href="http://hg.openjdk.java.net/jdk9/client/jdk/file/">OpenJDK repositories</a>
    under the following source trees:
  </p>
  <p>
    <pre>
    src/java.desktop/{share,unix,windows}/
    &nbsp;&nbsp;&nbsp;&nbsp;.../classes/sun/java2d/opengl
    &nbsp;&nbsp;&nbsp;&nbsp;.../native/common/java2d/opengl</pre>
  </p>
  <p>
    In addition to my work on Java2D, I helped out a bit with the open source
    JOGL project, which provides Java bindings to the native OpenGL libraries,
    in addition to a number of utility packages.  I assisted in developing a
    high performance version
    of <a href="http://download.java.net/media/jogl/jogl-2.x-docs/javax/media/opengl/awt/GLJPanel.html"><code>GLJPanel</code></a>
    that allows for mixing 2D content (using Java2D and Swing) and 3D content
    (using JOGL/OpenGL) in the same window.  I also helped create some utility
    classes (<a href="http://download.java.net/media/jogl/jogl-2.x-docs/com/sun/opengl/util/texture/TextureIO.html"><code>TextureIO</code></a>, etc)
    that help bridge the gap between Java2D and JOGL.
  </p>
  <p>
    Here are links to a couple blog entries I wrote that contain demos of
    these features (including source code).  Unfortunately java.net is no
    longer a thing, but the Wayback Machine comes to the rescue:
  </p>
  <div>
    <p style="padding-top:8px;">
      <a href="https://web.archive.org/web/20061103135202/http://weblogs.java.net/blog/campbell/archive/2006/10/easy_2d3d_mixin.html">
        <b>PhotoCube</b></a> - demonstrates the use of <code>GLJPanel</code> for
      easy mixing of 2D and 3D content in the same window
    </p>
    <p>
      <a href="https://web.archive.org/web/20100113105101/http://weblogs.java.net/blog/2007/01/23/java-2d-and-jogl-flip-side">
        <b>BezierAnim3D</b></a> - demonstrates the use of the <code>TextureIO</code>,
      <code>TextureRenderer</code>, and <code>TextRenderer</code> classes to take advantage
      of Java2D features from a JOGL/OpenGL application
    </p>
  </div>
</div>

<!-- Note: This is at the bottom on purpose; if it was at the top, it would interfere
     with the h3:not(:first-child) selector.
-->
<script>
<!--
function reveal_div(id) {
    document.getElementById(id + '_reveal').remove();
    document.getElementById(id + '_more').style.display='block';
}
-->
</script>
