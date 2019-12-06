---
layout: post
title:  "iPhoto to Lightroom (to Flickr and Beyond)"
date:   2011-04-03 17:54:50 -0800
tags:   [code, photography]
---
Ever since taking a mild interest in photography back in high school, I’ve gone through various stages…

There have been the usual wallet-draining equipment upgrades every few years. A cheap point-and-shoot film camera in 1996. My first digital camera [a Kodak DC 280] in 1999. A better point-and-shoot digital [a Canon S60] in 2004. My first DSLR [a Canon XTi] in 2006. And finally, the leap to a Canon 7D earlier this year.

There were different organization methods and tools… Originally I just scanned photos in and scattered them haphazardly on my hard drive. Later I tried some shoddy photo manager from Ulead, which was so limiting (only 256 characters for comments? binary file format?) that I started writing my own photo organization software in 1999 (called JAlbum, not to be confused with a later, presumably more successful product of the same name). I rarely used the desktop app part of JAlbum, but there was a barebones photo album server component to it that I ran on my own Linux box for a few years. Eventually I got tired of managing (and hearing) my homebuilt server and photo software, so around 2005 I decided to give in and just get a Mac mini for serving photos to the few friends that wanted to see them, and started entrusting my expanding photo library to iPhoto.

When I upgraded to a Flickr Pro account back in 2006, I attempted to draw a line in the sand, thinking that I would only post new (presumably only good) photos on Flickr. I’d keep all the old photos backed up through some combination of CD-Rs and DVDs and hard drives strategically placed around the country. When I started shooting RAW full time in 2007 and moved on to Lightroom, I made a similar decision (or so I thought) to just keep the new/good photos organized in Lightroom, and leave the rest sitting in iPhoto for posterity.

The reason I mention all this boring history is to make it clear that my decisions never last, and I’m always thinking that there must be a better way to shoot photos and to organize them. Specifically, I’ve been worried about losing old photos, even if only a small handful will be of interest decades from now. So a few weeks ago, as if I had tons of spare time on my hands (which I no longer do; my days are filled with chasing the little tyke around the house), I got it in my head that I would REALLY get my money’s worth from my Flickr Pro account and use it as a backup-backup solution for all my photos.

The general plan was to write some scripts to migrate all my 1997-2008 photos over to Lightroom, preserving as much of the keywording, titles, and captions that I had added over the years in iPhoto and my homebrewed apps. Then once I was satisfied with that, I would find any of the pre-2006 photos (and videos) not already at Flickr and make sure they were available there as well. When complete, I wanted to make sure that for every photo in my Lightroom catalog there would be a corresponding item at Flickr, and vice versa (no duplicates, all organized into folders/sets, no loose ends).
<br/>
<br/>

__1. Migrate iPhoto albums to Lightroom folders__

Prior to using iPhoto, I organized my photos on my hard drive by placing photos for a given day in a folder named “MMDD (Single Event Title)”, like this:

```
Pictures/
    2003/
        ...
    2004/
        0307 (Alamere Falls)
        0501 (Coachella)
        0515 (Mendocino)
        0617 (Mean Toledo)
        0703 (At Camp)
        0704 (At Camp)
        0708 (Adirondack Chair)
        ...
    2005/
        ...
```

When I started using iPhoto, I preserved this directory structure, but I also organized them into iPhoto albums, which allowed for logical groupings of multi-day events and made it easier to upload a whole album to a Flickr set. At the time, I preferred to have most recent albums at the top of the album browser, so the above folder structure might have translated to iPhoto albums like this:

```
    Y2005
        ...
    Y2004
        July 4th in Red Hook
        Mean Toledo
        Mendocino
        Coachella
        Alamere Falls
```

However, once I started using Lightroom a few years ago, I settled back on a naming convention that was a hybrid of those two approaches, placing all photos from a logical event into a folder named “MM.DD Event Title”. (In case of multi-day events, MM.DD refers to the first day of the event.) So, I decided to write a little AppleScript that would take a selection of iPhoto albums and copy each album’s contents into a folder using this new naming scheme, for example:

```
    Pictures/
        2003/
            ...
        2004/
            03.07 Alamere Falls
            05.01 Coachella
            05.15 Mendocino
            06.17 Mean Toledo
            07.03 July 4th in Red Hook
            ...
        2005/
            ...
```

In addition, I wanted to preserve any keywords, titles, and captions that I had added in iPhoto over the years. I also wanted to include the original directory name somewhere (since in some cases it provided a little more detail than the album name did, especially for multi-day albums). For this, I turned to Phil Harvey’s awesome [ExifTool](http://www.sno.phy.queensu.ca/~phil/exiftool/) utility. In my AppleScript, I extracted the iPhoto keywords, titles, and captions, added the original folder name to the caption, and fed this into ExifTool for each migrated photo. Later, when importing the photos into Lightroom, this data would be pulled automatically from the IPTC tags in the JPEG files and included in the Lightroom catalog.

You can find the resulting “Export iPhoto Albums” AppleScript [here](/files/photo-scripts/Export%20iPhoto%20Albums.scpt) (MIT licensed). It didn’t take too long to put together. It was a little tricky making sure that titles and captions that included single or double quotes were escaped properly before calling out to exiftool via the shell (always a nightmare when mixing shell-script-like syntax with another scripting language). Also, I ran into a bizarre issue that I had managed to forget from years ago, when Candice and I each brought cameras to Greece, and through some crazy coincidence both CF cards were taking photos in the same filename range (e.g. we both had photos named IMG_1234.JPG), so when my script ran, some of my photos would overwrite hers, or vice versa. It took me a while to figure out why the file count was different between the iPhoto album and the exported folder. I didn’t take the time to fix it properly, so you’ll see a gross hack in the code. Just something to be aware of if anyone else tries to use this script.
<br/>
<br/>

__2. Import photos (and videos) into Lightroom__

Once I had all my iPhoto albums exported to folders for each year from 1997 through 2007, importing them into my Lightroom catalog as folders was a snap. However, I wanted to use this opportunity to finally organize all the little video clips I had taken over the years with my S60 and Nexus One. Prior to Lightroom 3, my only option was to keep videos roughly organized (well, in most cases, completely unorganized) in some folder on my hard drive. But now with Lightroom 3, it’s possible to keep videos organized alongside photos in folders and collections, so I took some time to put old videos into their corresponding folders.

It’s worth mentioning that the S60 saved videos as AVI files, which Lightroom 3 handles just fine, but my Android phone saves videos with a 3GP extension. After some googling, I found that 3GP is a variant on MP4, which Lightroom 3 does support, so luckily it was just a matter of renaming those video files to have a .mp4 extension instead of a .3gp one, and Lightroom imported them without any trouble.

(On the other hand, Lightroom doesn’t seem to recognize the original capture time of these videos. I spent a couple fruitless hours trying to figure out a way to create sidecars for all the video files using ExifTool to extract the capture time so it would appear in the Lightroom catalog metadata, but I never got it to work so I just gave up. In most cases, the capture time isn’t critical, since it can be inferred from the file’s timestamp or from just guessing based on adjacent photos, so no big loss.)
<br/>
<br/>

__3. Export photos (and videos) from Lightroom to Flickr__

Here’s where it got pleasantly easy. I’ve been using [Jeffrey Friedel’s](http://regex.info/blog/) fantastic [“Export to Flickr” Lightroom Plugin](http://regex.info/blog/lightroom-goodies/flickr) for exactly as long as I’ve used Lightroom. It makes exporting from Lightroom to Flickr very simple, but during this recent project I discovered two features of the plugin that make it even more of a gem.

When it came time to upload my pre-2006 photos and videos to Flickr, I wanted to continue my usual process of exporting each Lightroom folder to a corresponding photo set on Flickr, but I wasn’t looking forward to tediously uploading one folder at a time, entering in the name of the Flickr set each time, over and over again (a hundred or so times). I was delighted to discover that Jeffrey’s plugin has support for “automatic destinations”, where you can automatically specify the destination Flickr set using metadata from the photos that are being uploaded. (See the “add/edit auto destinations” link in the “Upload Destination” section of the “jf Flickr” export dialog in Lightroom.) There are tons of built-in templates and tokens, so, for example, you can use the photo date or folder name as the name of the set. But in my case, I wanted a way to convert my Lightroom “MM.DD Event” naming convention to my less nerdy, date-prefix-less Flickr “Event” naming convention. It turns out that Jeffrey’s plugin is based in part on Lua, so you can put a Lua expression (i.e., code) in there for more powerful templating. A quick Google search revealed the Lua syntax for getting a substring, so I could convert “MM.DD Event” to “Event” with the following one-liner:

```
    {LUA=string.sub(Folder, 7)}
```

Now, it was possible to select a whole year’s worth of photos, click the Export button, and by the next morning they would all be up on Flickr, neatly organized into sets according to their folder names. So much better than the manual approach.
<br/>
<br/>

__4. Link existing photos (and videos) on Flickr to items in Lightroom__

My usual workflow in Lightroom is based around a Smart Collection called “Unfiled”, which includes all photos that don’t have the “Uploaded to Flickr” flag set. (I consider a photo as “done” once I’ve edited it and uploaded it to Flickr, so this shows me all the ones that need work.) But what about all those photos that I had uploaded to Flickr between 2006 and 2008 before I started using Jeffrey’s plugin? I wouldn’t want to re-upload them to Flickr, and I was getting worried that I’d have to go through all those Flickr photos and manually link them to my Lightroom catalog so that they don’t show up in my “Unfiled” collection.

That’s when I discovered a second, awesome, previously-unknown-to-me feature of Jeffrey’s plugin, which is buried up in the File / Plugin Extras / Flickr Extras menu. Basically, you can select a batch of photos, then navigate to that menu item and select “Associate Images Automatically”, and the plugin will match photo dates from your Lightroom catalog to existing photos on Flickr in an attempt to figure out if they’re the same, and if so, it will mark them as “Uploaded to Flickr” and save that Flickr URL in your Lightroom catalog. This worked about 99% of the time; the only troublesome photos are ones taken in burst mode or ones that have virtual copies (like if I uploaded an image in both color and black-and-white), but these are easily resolved using the “Associate Images Manually” button. These features were a huge time saver, so three cheers for Jeffrey! 
<br/>
<br/>

__5. Find stray photos that aren’t properly linked between Lightroom and Flickr__

After completing these four steps (a couple weeks later), I was certain that the end was in sight and that I would soon resume normal life, but alas, Flickr reported 10,547 items, and my Lightroom catalog claimed 10,529 items. Since there’s no way I could rest soundly knowing that I was a miserable failure of a human, with a complete lack of symmetry in my photo collection and therefore my life (overstatement, yes, but this is how my brain works), I decided to forego sleep and wrote a Perl script (yes, Perl; someday I’ll learn something more hip) that would fetch all the photo page URLs from my Flickr account, and would compare that list to the ones recorded by Jeffrey’s plugin in Lightroom.

The first part was kind of a pain. After a few minutes of fruitless googling, I concluded that there weren’t any programs out there that would simply fetch your photo page URLs from a Flickr account. (There are plenty that will download the photos themselves, but not the URLs.) I had used some Java libraries years ago to interact with Flickr’s APIs, but lately at work I’ve found myself to be pretty handy with curl and simple scripts, so I wanted something quick and dirty. I looked into the various Flickr libraries for Python, Ruby, Perl, and even PHP (yow) but they all seemed to require actual thought and some amount of bootstrapping work. That said, I went with the [Flickr::API](http://search.cpan.org/~iamcal/Flickr-API/) library for Perl and found a few brief but confusing examples on the net showing how to use them. Eventually (after first signing up for a [Flickr API key](http://www.flickr.com/services/api/)) I wrangled together some Perl code that would download all of my photo identifiers, from which I could figure out the corresponding photo page URLs.

Up until then I had assumed that it would be easy to export metadata (such as the Flickr URL for each photo as recorded by Jeffrey’s plugin) from Lightroom to, say, a simple text file. It turns out that there is no built-in support for metadata export, but fortunately another fellow named [Timothy Armes](http://www.timothyarmes.com/) wrote a similarly awesome Lightroom plugin called [LR/Transporter](http://www.photographers-toolbox.com/products/lrtransporter.php), which allows for exporting metadata summaries to a plain text file. To capture a list of all the Flickr URLs from my Lightroom catalog, I selected File / Plugin Extras / Export Metadata using LR/Transporter, then Summary File, and in the “Specify text to add for each photo” field I specified:

```
    {pluginField[info.regex.lightroom.export.flickr2,url]}{return}
```

Feeding the resulting text file into my [diff-flickr-lr.pl](/files/photo-scripts/diff-flickr-lr.zip) script (also MIT licensed) produced a simple HTML page (with photos and links) revealing a couple dozen discrepancies between my Lightroom catalog and Flickr collection, some of which were simple mistakes on my part when using the “Associate Images Manually” approach mentioned earlier, some of which were caused by photos and screenshots I had uploaded to Flickr years ago but never maintained in iPhoto, and a few of which turned out to be Candice’s paintings that were stored in my Lightroom catalog but uploaded to her own Flickr account instead of mine.

Finally (finally!) after clearing up those issues, I checked my Flickr account: 10,565 items. Then, my Lightroom catalog: 10,565 items. Now I can sleep soundly.
