/*
 * Sloan-o-graph PaperScript
 *
 * Copyright (c) 2014 Chris Campbell
 * All rights reserved.
 */

var bgColor = "#222";

var textStyle = {
    fontFamily: "Helvetica Neue",
    fontWeight: 300
};

var viewcx = view.viewSize.width / 2;
var viewcy = 360;

var coverSize = 45;
var albumRingRadius = 250;
var albumTextOffset = 80;

var personSize = 70;
var personHaloWidth = 4;

var persons = {
    "A": { name: "Andrew", color: "#992E2E" },
    "C": { name: "Chris", color: "#2E9999" },
    "J": { name: "Jay", color: "#99992E" },
    "P": { name: "Patrick", color: "#2E992E" }
};

var personKeys = ["A", "J", "C", "P"];
var personRingRadius = 120;

var personAngles = {};
var personCenters = {};

var albumItems = [];
var songItems = [];
var personItems = [];
var personLinkItems = [];

var albumAnimParams = {};
var songAnimParams = {};
var personAnimParams = {};
var personLinkAnimParams = {};
var highlightAnimParams = [];
var enableHighlightAnim = false;

var sortAnimParams = {};
var enableSortAnim = true;

var primaryAlbumCount = 14;
var secondaryAlbumCount = 4;

for (var i = 0; i < personKeys.length; i++) {
    var personKey = personKeys[i];
    var person = persons[personKey];
    var degs = ((i * 360) / personKeys.length) - 90;
    var pt = pointOnArc(viewcx, viewcy, personRingRadius, degs);
    personAngles[personKey] = degs;
    personCenters[personKey] = pt;
}

// XXX: Make our sort functions available from JS, from:
//   https://groups.google.com/forum/#!topic/paperjs/VgaDZRsNS9I
window.globals = {};

/*
 *
 * MATHS
 *
 */

function toDegrees(angle) {
    return angle * (180 / Math.PI);
}

function toRadians(angle) {
    return angle * (Math.PI / 180);
}

function pointOnArc(cx, cy, radius, angle) {
    var radians = toRadians(angle);

    // dx:
    //   cos t = dx / r
    //   dx = r * cos t
    // dy:
    //   sin t = dy / r
    //   dy = r * sin t

    var px = cx + (radius * Math.cos(radians));
    var py = cy + (radius * Math.sin(radians));

    return new Point(px, py);
}

/*
 *
 * ALBUM ITEMS
 *
 */

function addArcToPath(path, cx, cy, radius, startAngle, endAngle) {
    var midAngle = startAngle + ((endAngle - startAngle) / 2);

    var startPt = pointOnArc(cx, cy, radius, startAngle);
    var throughPt = pointOnArc(cx, cy, radius, midAngle);
    var endPt = pointOnArc(cx, cy, radius, endAngle);

    path.moveTo(new Point(cx, cy));
    path.lineTo(startPt);
    path.arcTo(throughPt, endPt);
}

function addPieSlice(song, album, cx, cy, baseSize, sweep, angle, songText, albumText) {
    var songSize = baseSize + (song.seconds / 5);
    if (songSize > 210) {
        // XXX: Hack to make "Forty-eight Portraits" less tall
        songSize = 210;
    } else if (song.title == "Before I Do") {
        // XXX: Hack to make "Before I Do" not crowd Smeared
        songSize = 115;
    }
    var color = persons[song.lead].color;
    
    var path = new Path({
            fillColor: color,
            strokeColor: bgColor,
            strokeWidth: 1,
            closed: true
        });
    addArcToPath(path, cx, cy, songSize / 2, 0, sweep);
    path.pivot = new Point(cx, cy);
    path.rotation = angle;
    
    path.onMouseEnter = function(event) {
        var brighterColor = new Color(color);
        brighterColor.brightness = 1.0;
        this.fillColor = brighterColor;
        songText.content = song.title;
        songText.visible = true;
        albumText.visible = true;
        highlightAlbum(album);
        highlightPersonsForSong(song);
        highlightLinksForSong(song);
    }
    
    path.onMouseLeave = function(event) {
        this.fillColor = color;
        songText.visible = false;
        albumText.visible = false;
        resetAlbumHighlighting();
        resetLinkHighlighting();
        resetPersonHighlighting();
    }

    var songItem = {
        song: song,
        album: album,
        item: path
    }
    songItems.push(songItem);

    return songItem;
}

function addPieChart(cx, cy, baseSize, songs, album, songText, albumText) {
    var sweep = 360 / songs.length;
    var angle = -90;
    var albumSongItems = [];
    for (var i = 0; i < songs.length; i++) {
        var song = songs[i];
        var songItem = addPieSlice(song, album, cx, cy, baseSize, sweep, angle, songText, albumText);
        albumSongItems.push(songItem);
        angle += sweep;
    }
    return albumSongItems;
}

function addAlbum(i, album) {
    // XXX: Adjust angle so that first and last album are at top
    var degs = ((i * 360) / primaryAlbumCount) - 90 + (180 / primaryAlbumCount);

    var center = pointOnArc(viewcx, viewcy, albumRingRadius, degs);
    var textPt = pointOnArc(viewcx, viewcy, albumRingRadius + albumTextOffset, degs);

    if (i == 0) {
        // XXX: Nudge Peppermint to the right
        textPt.x += 16;
    } else if (i == 2 || i == 3) {
        // XXX: Move text for TR and OCTA to the left
        textPt.x -= 14;
    } else if (i == 4) {
        // XXX: Move NB text to avoid overlapping with OCTA outtakes
        textPt.x -= 4;
        textPt.y -= 40;
    } else if (i == 5) {
        // XXX: Nudge text over so that it doesn't get too crowded
        // when Patrick's singles are shown
        textPt.x += 10;
        textPt.y -= 15;
    } else if (i == 6) {
        // XXX: Move text up and to the right for the bottom-most album
        // so that it doesn't crowd the bar charts
        textPt.x += 40;
        textPt.y -= 20;
    } else if (i >= 7 && i <= 11) {
        // XXX: Move text to the right to account for shorter songs on
        // these albums
        if (i == 7) {
            textPt.x += 4;
            textPt.y -= 10;
        } else if (i == 8) {
            textPt.x += 56;
            textPt.y += 18;
        } else if (i == 11) {
            textPt.x += 22;
            textPt.y -= 20;
        } else {
            textPt.x += 20;
        }
    } else if (i == 12) {
        // XXX: Nudge text over to account for extra-tall
        // "Forty-eight Portraits"
        textPt.x -= 10;
        textPt.y += 10;
    }
    
    var rightJustify = center.x < viewcx;
    addAlbumAtCenterPoint(album, center, textPt, rightJustify);
}

function addAlbumAtCenterPoint(album, center, textPt, rightJustify) {
    var songText = new PointText(textPt);
    songText.style = textStyle;
    songText.fillColor = "white";
    if (rightJustify) {
        songText.justification = "right";
    }
    songText.visible = false;

    var albumText = new PointText(new Point(textPt.x, textPt.y + 16));
    albumText.style = textStyle;
    albumText.fillColor = "#aaa";
    albumText.content = album.title + "\n" + album.year;
    if (rightJustify) {
        albumText.justification = "right";
    }
    albumText.visible = false;

    var songs = getSongsGroupedByPerson(album);
    var albumSongItems = addPieChart(center.x, center.y, coverSize,
                                     songs, album, songText, albumText);

    // Add a transparent circle and use that for hit testing, otherwise
    // transparent areas of the image will trigger events
    var circle = new Path.Circle({
            center: center,
            radius: (coverSize / 2) + 1,
            fillColor: bgColor
        });

    circle.onMouseEnter = function(event) {
        highlightAlbum(album);
        highlightLinksForAlbum(album);
        songText.visible = false;
        albumText.visible = true;
    }
    circle.onMouseLeave = function(event) {
        resetAlbumHighlighting();
        resetLinkHighlighting();
        songText.visible = false;
        albumText.visible = false;
    }

    var raster = new Raster(album.cover);
    raster.position = new Point(center.x, center.y);
    if (window.devicePixelRatio == 2) {
        raster.scaling = new Point(0.5, 0.5);
    }
    project.activeLayer.addChild(raster);

    // Don't let the image (i.e., its transparent areas) factor into hit testing
    raster.locked = true;

    var pieItems = [];
    for (var i = 0; i < albumSongItems.length; i++) {
        var songItem = albumSongItems[i];
        pieItems.push(songItem.item);
    }
    var group = new Group(pieItems.concat([circle, raster]));

    var albumItem = {
        album: album,
        songText: songText,
        albumText: albumText,
        albumSongItems: albumSongItems,
        item: group
    }
    albumItems.push(albumItem);
}

function addAlbums() {
    for (var i = 0; i < primaryAlbumCount; i++) {
        var album = albums[i];
        album.primary = true;
        addAlbum(i, album);
    }

    // XXX
    for (var i = primaryAlbumCount; i < primaryAlbumCount + secondaryAlbumCount; i++) {
        var album = albums[i];
        album.primary = false;
    }

    var cl = 90;
    var cr = 910;
    var ct = 150;
    var cb = 560;
    
    var tl = 60;
    var tr = 970;
    var tt = 214;
    var tb = 630;

    var bs1   = albums[primaryAlbumCount  ];
    var bs2   = albums[primaryAlbumCount+1];
    var trOut = albums[primaryAlbumCount+2];
    var ocOut = albums[primaryAlbumCount+3];
    addAlbumAtCenterPoint(bs1,   new Point(cl, ct), new Point(tl, tt), false);
    addAlbumAtCenterPoint(bs2,   new Point(cl, cb), new Point(tl, tb), false);
    addAlbumAtCenterPoint(trOut, new Point(cr, ct), new Point(tr, tt), true);
    addAlbumAtCenterPoint(ocOut, new Point(cr, cb), new Point(tr, tb), true);
    
    setSecondaryAlbumsVisible(false);
}

function setSecondaryAlbumsVisible(visible) {
  for (var i = 0; i < secondaryAlbumCount; i++) {
    var albumItem = albumItems[primaryAlbumCount + i];
    albumItem.item.visible = visible;
  }
}

globals.showSecondaryAlbums = function() {
  setSecondaryAlbumsVisible(true);
};

globals.hideSecondaryAlbums = function() {
  setSecondaryAlbumsVisible(false);
};

globals.secondaryAlbumCheckboxClicked = function(cb) {
  setSecondaryAlbumsVisible(cb.checked)
};

/*
 *
 * PERSON ITEMS
 *
 */

function addPerson(cx, cy, personKey) {
    var person = persons[personKey];

    var nameText = new PointText();
    if (personKey === "P" || personKey === "C") {
        nameText.position = new Point(cx - 20, cy + 50);
        nameText.justification = "right";
    } else {
        nameText.position = new Point(cx + 20, cy - 42);
    }
    nameText.style = textStyle;
    nameText.fillColor = "#777";
    nameText.content = person.name;
    nameText.visible = false;
    
    // Add an opaque circle that blacks out links even when person is dimmed
    var personHaloRadius = (personSize / 2) + personHaloWidth;
    var blackout = new Path.Circle({
            center: [cx, cy],
            radius: personHaloRadius,
            fillColor: bgColor
        });

    var circle = new Path.Circle({
            center: [cx, cy],
            radius: personHaloRadius,
            fillColor: person.color
        });

    var raster = new Raster(person.name.toLowerCase());
    raster.position = new Point(cx, cy);
    if (window.devicePixelRatio == 2) {
        raster.scaling = new Point(0.5, 0.5);
    }
    project.activeLayer.addChild(raster);

    var group = new Group([circle, raster]);

    // Highlight pie slices and links when hovering over person
    group.onMouseEnter = function(event) {
        highlightSongsForPerson(personKey, true, true);
        highlightLinksForPerson(personKey);
        highlightPerson(personKey);
        nameText.visible = true;
    }
    group.onMouseLeave = function(event) {
        resetSongHighlighting();
        resetLinkHighlighting();
        resetPersonHighlighting();
        nameText.visible = false;
    }

    var personItem = {
        personKey: personKey,
        person: person,
        item: group
    };
    personItems.push(personItem);
}

function addPersons() {
    for (var i = 0; i < personKeys.length; i++) {
        var personKey = personKeys[i];
        var pt = personCenters[personKey];
        addPerson(pt.x, pt.y, personKey);
    }
}

/*
 *
 * PERSON LINK ITEMS
 *
 */

function getOtherPersonKeys(personKey) {
    var keys = [];
    for (var i = 0; i < personKeys.length; i++) {
        var otherPersonKey = personKeys[i];
        if (personKey !== otherPersonKey) {
            keys.push(otherPersonKey);
        }
    }
    return keys;
}

function getBackupSongItems(backupPersonKey, leadPersonKey) {
    var backupSongItems = [];
    for (var i = 0; i < songItems.length; i++) {
        var songItem = songItems[i];
        var song = songItem.song;
        if (song.lead === leadPersonKey && song.backups.indexOf(backupPersonKey) >= 0) {
            backupSongItems.push(songItem);
        }
    }
    return backupSongItems;
}

function addPersonLink(song, album, fromPersonKey, toPersonKey, handleRadius) {
    var fromPerson = persons[fromPersonKey];

    var fromPersonCenter = personCenters[fromPersonKey];
    var toPersonCenter = personCenters[toPersonKey];

    var handle;
    if (fromPersonCenter.x == toPersonCenter.x) {
        if (fromPersonCenter.y < toPersonCenter.y) {
            // Link goes from top to bottom; curve to the right
            handle = new Point(fromPersonCenter.x + handleRadius, viewcy);
        } else {
            // Link goes from bottom to top; curve to the left
            handle = new Point(fromPersonCenter.x - handleRadius, viewcy);
        }
    } else if (fromPersonCenter.y == toPersonCenter.y) {
        if (fromPersonCenter.x < toPersonCenter.x) {
            // Link goes from left to right; curve to the top
            handle = new Point(viewcx, fromPersonCenter.y - handleRadius);
        } else {
            // Link goes from right to left; curve to the bottom
            handle = new Point(viewcx, fromPersonCenter.y + handleRadius);
        }
    } else {
        // Persons are "adjacent" on the ring
        var fromPersonAngle = personAngles[fromPersonKey];
        var toPersonAngle = personAngles[toPersonKey];
        // XXX: Hack to make links between A and P convex
        if (fromPersonAngle < 0 && toPersonAngle > 0) {
            fromPersonAngle += 360;
        }
        if (fromPersonAngle > 0 && toPersonAngle < 0) {
            toPersonAngle += 360;
        }
        var midAngle = fromPersonAngle + ((toPersonAngle - fromPersonAngle) / 2);

        var fromPersonIndex = personKeys.indexOf(fromPersonKey);
        var toPersonIndex = personKeys.indexOf(toPersonKey);
        var indexDiff = toPersonIndex - fromPersonIndex;
        var radius;
        if (indexDiff == 1 || indexDiff == -3) {
            // Link is in clockwise direction; curve to the outside
            radius = personRingRadius + handleRadius;
        } else {
            // Link is in counterclockwise direction; curve to the inside
            radius = personRingRadius - handleRadius;
        }
        handle = pointOnArc(viewcx, viewcy, radius, midAngle);
    }

    var path = new Path({
            strokeColor: fromPerson.color,
            closed: false
        });

    path.moveTo(fromPersonCenter);
    path.quadraticCurveTo(handle, toPersonCenter);

    var personLinkItem = {
        song: song,
        album: album,
        fromPersonKey: fromPersonKey,
        fromPerson: fromPerson,
        item: path
    };
    personLinkItems.push(personLinkItem);
}

function addPersonLinks() {
    for (var i = 0; i < personKeys.length; i++) {
        var fromPersonKey = personKeys[i];
        var toPersonKeys = getOtherPersonKeys(fromPersonKey);
        for (var j = 0; j < toPersonKeys.length; j++) {
            var toPersonKey = toPersonKeys[j];
            var backupSongItems = getBackupSongItems(fromPersonKey, toPersonKey);
            for (var k = 0; k < backupSongItems.length; k++) {
                var songItem = backupSongItems[k];
                var song = songItem.song;
                var album = songItem.album;
                addPersonLink(song, album, fromPersonKey, toPersonKey, (k + 1) * 4);
            }
        }
    }
}

/*
 *
 * BAR CHARTS
 *
 */

function addBar(x, y, w, h, personKey, enterFunc, exitFunc) {
    var person = persons[personKey];

    var bar = new Path.Rectangle({
            from: [x, y],
            to: [x + w, y + h],
            fillColor: person.color
        });

    bar.onMouseEnter = function(event) {
        var brighterColor = new Color(person.color);
        brighterColor.brightness = 1.0;
        bar.fillColor = brighterColor;
        highlightPerson(personKey);
        dimLinkHighlighting();
        enterFunc(personKey);
    }
    bar.onMouseLeave = function(event) {
        bar.fillColor = person.color;
        resetPersonHighlighting();
        resetLinkHighlighting();
        exitFunc(personKey);
    }

    var initialText = new PointText(new Point(x + 10, y + h - 2));
    initialText.style = textStyle;
    initialText.fillColor = bgColor;
    initialText.content = person.name.substring(0, 1);
    initialText.justification = "center";
    initialText.locked = true;
}

function addBarChart(title, x, y, w, h, chartItems, maxValue, label0, label1, label2, enterFunc, exitFunc) {
    var barH = 13;
    var barPadY = (h - (chartItems.length * barH)) / (chartItems.length + 1);

    var barX = x + 1;
    var barY = y + barPadY;

    var titleText = new PointText(new Point(x + 3, y - 10));
    titleText.style = textStyle;
    titleText.fontSize += 2;
    titleText.fillColor = "#ccc";
    titleText.content = title;

    var axisColor = "white";
    var axisOpacity = 0.3;
    var yAxis = new Path.Line({
            from: [x, y],
            to: [x, y + h],
            strokeColor: axisColor,
            opacity: axisOpacity
        });
    var xAxis = new Path.Line({
            from: [x, y + h],
            to: [x + w, y + h],
            strokeColor: axisColor,
            opacity: axisOpacity
        });

    var labelColor = "#888";
    var labelY = y + h + 15;
    
    function addLabel(content, labelX) {
        var labelText = new PointText(new Point(labelX, labelY));
        labelText.style = textStyle;
        labelText.fillColor = labelColor;
        labelText.content = content;
        labelText.justification = "center";
    }
    addLabel(label0, x);
    addLabel(label1, x + (w / 2));
    addLabel(label2, x + w);

    // Sort items in descending order
    chartItems.sort(function(a, b) { return b.value - a.value; });
    for (var i = 0; i < chartItems.length; i++) {
        var chartItem = chartItems[i];
        var barW = w * (chartItem.value / maxValue);
        addBar(barX, barY, barW, barH, chartItem.personKey, enterFunc, exitFunc);
        barY += barH + barPadY;
    }
}

function addBarCharts() {
    var chartW = 170;
    var chartH = 100;

    var firstX = viewcx - (chartW * 2.25);
    var middleX = viewcx - (chartW / 2);
    var lastX = viewcx + (chartW * 1.25);
    
    var firstRowY = 740;
    var secondRowY = 920;

    function getSongsForPerson(personKey) {
        var songs = [];
        for (var i = 0; i < primaryAlbumCount; i++) {
            var album = albums[i];
            for (var j = 0; j < album.songs.length; j++) {
                var song = album.songs[j];
                if (song.lead === personKey) {
                    songs.push(song);
                }
            }
        }
        return songs;
    }

    function getChartItems(func) {
        var chartItems = [];
        for (var i = 0; i < personKeys.length; i++) {
            var personKey = personKeys[i];
            var chartItem = {
                personKey: personKey,
                value: func(personKey)
            };
            chartItems.push(chartItem);
        }
        return chartItems;
    }

    // Singles / total songs
    function getSingleToTotalRatio(personKey) {
        var songs = getSongsForPerson(personKey);
        var totalSingles = 0;
        for (var i = 0; i < songs.length; i++) {
            var song = songs[i];
            if (song.single) {
                totalSingles++;
            }
        }
        return totalSingles / songs.length;
    }
    addBarChart("# singles vs songs written",
                firstX, firstRowY, chartW, chartH,
                getChartItems(getSingleToTotalRatio), 0.4, "0%", "20%", "40%",
                function(personKey) {
                    highlightSongsAndTitlesForPerson(personKey, function(songItem) {
                        return songItem.song.single;
                    });
                },
                function(personKey) {
                    resetSongAndTitleHighlighting();
                });
    
    // First song on album
    function getFirstSongCount(personKey) {
        var count = 0;
        for (var i = 0; i < primaryAlbumCount; i++) {
            var albumItem = albumItems[i];
            var album = albumItem.album;
            var firstSong = album.songs[0];
            if (firstSong.lead === personKey) {
                count++;
            }
        }
        return count;
    }
    addBarChart("First song on album",
                middleX, firstRowY, chartW, chartH,
                getChartItems(getFirstSongCount), 10, "0", "5", "10",
                function(personKey) {
                    highlightSongsAndTitlesForPerson(personKey, function(songItem) {
                        return songItem.album.songs[0] == songItem.song;
                    });
                },
                function(personKey) {
                    resetSongAndTitleHighlighting();
                });
    
    // Last song on album
    function getLastSongCount(personKey) {
        var count = 0;
        for (var i = 0; i < primaryAlbumCount; i++) {
            var albumItem = albumItems[i];
            var album = albumItem.album;
            var lastSong = album.songs[album.songs.length - 1];
            if (lastSong.lead === personKey) {
                count++;
            }
        }
        return count;
    }
    addBarChart("Last song on album",
                lastX, firstRowY, chartW, chartH,
                getChartItems(getLastSongCount), 10, "0", "5", "10",
                function(personKey) {
                    highlightSongsAndTitlesForPerson(personKey, function(songItem) {
                        return songItem.album.songs[songItem.album.songs.length - 1] == songItem.song;
                    });
                },
                function(personKey) {
                    resetSongAndTitleHighlighting();
                });

    // Total songs
    function getTotalSongs(personKey) {
        var songs = getSongsForPerson(personKey);
        return songs.length;
    }
    addBarChart("Total songs",
                firstX, secondRowY, chartW, chartH,
                getChartItems(getTotalSongs), 100, "0", "50", "100",
                function(personKey) {
                    highlightSongsForPerson(personKey, false, false)
                },
                function(personKey) {
                    resetSongHighlighting();
                });

    // Average song length
    function getAverageSongLength(personKey) {
        var songs = getSongsForPerson(personKey);
        var totalSeconds = 0;
        for (var i = 0; i < songs.length; i++) {
            var song = songs[i];
            totalSeconds += song.seconds;
        }
        return totalSeconds / songs.length;
    }
    addBarChart("Average song length",
                middleX, secondRowY, chartW, chartH,
                getChartItems(getAverageSongLength), 240, "0:00", "2:00", "4:00",
                function(personKey) {
                    highlightSongsForPerson(personKey, false, false)
                },
                function(personKey) {
                    resetSongHighlighting();
                });
                
    // Average song title word count
    function getAverageTitleWordCount(personKey) {
        var songs = getSongsForPerson(personKey);
        var totalWords = 0;
        for (var i = 0; i < songs.length; i++) {
            var song = songs[i];
            totalWords += song.title.split(" ").length;
        }
        return totalWords / songs.length;
    }
    addBarChart("Average words per song title",
                lastX, secondRowY, chartW, chartH,
                getChartItems(getAverageTitleWordCount), 4, "0", "2", "4",
                function(personKey) {
                    highlightSongsForPerson(personKey, false, false)
                },
                function(personKey) {
                    resetSongHighlighting();
                });
}

/*
 *
 * HIGHLIGHTING
 *
 */

function initHighlightAnimParams() {
    function createAnimParams(animItems) {
        var params = {
            animItems: animItems,
            triggerAnimations: false,
            startTime: 0.0,
            endTime: 0.0
        };
        highlightAnimParams.push(params);
        return params;
    }

    albumAnimParams = createAnimParams(albumItems);
    songAnimParams = createAnimParams(songItems);
    personAnimParams = createAnimParams(personItems);
    personLinkAnimParams = createAnimParams(personLinkItems);
}

function processHighlightAnimations(eventTime, animParams) {
    if (animParams.triggerAnimations) {
        animParams.startTime = eventTime;
        animParams.endTime = eventTime + 0.15;
        animParams.triggerAnimations = false;
    }
    if (animParams.endTime > 0) {
        var progress;
        if (eventTime < animParams.endTime) {
            // Step animations
            progress = (eventTime - animParams.startTime) / (animParams.endTime - animParams.startTime);
        } else {
            // Set all to target
            progress = 1.0;
            // Stop animation
            animParams.startTime = 0;
            animParams.endTime = 0;
        }
        for (var i = 0; i < animParams.animItems.length; i++) {
            var animItem = animParams.animItems[i];
            var item = animItem.item;
            if (item.opacity != animItem.targetOpacity) {
                item.opacity = animItem.startOpacity + (progress * (animItem.targetOpacity - animItem.startOpacity));
            }
        }
    }
}

function startHighlightAnimations(animParams) {
    if (enableHighlightAnim) {
        // Set the flag, which will be handled in the onFrame callback
        animParams.triggerAnimations = true;
    } else {
        // Otherwise, force all items to the target state immediately
        for (var i = 0; i < animParams.animItems.length; i++) {
            var animItem = animParams.animItems[i];
            var item = animItem.item;
            item.opacity = animItem.targetOpacity;
        }
    }
}

function highlightItems(animParams, func) {
    for (var i = 0; i < animParams.animItems.length; i++) {
        var animItem = animParams.animItems[i];
        animItem.targetOpacity = func(animItem);
        animItem.startOpacity = animItem.item.opacity;
    }
    startHighlightAnimations(animParams);
}

function resetHighlighting(animParams) {
    for (var i = 0; i < animParams.animItems.length; i++) {
        var animItem = animParams.animItems[i];
        animItem.targetOpacity = 1.0;
        animItem.startOpacity = animItem.item.opacity;
    }
    startHighlightAnimations(animParams);
}

function highlightAlbum(album) {
    highlightItems(albumAnimParams, function(albumItem) {
            if (albumItem.album == album) {
                return 1.0;
            } else {
                return 0.1;
            }
        });
}

function resetAlbumHighlighting() {
    resetHighlighting(albumAnimParams);
}

function keyForAlbum(album) {
    return album.title + "::" + album.year;
}

function highlightSongsForPerson(personKey, includeBackups, includeSecondaryAlbums) {
    // Flag the case where no songs on an album are highlighted so we can dim that album
    var albumKeysToHighlight = [];

    function isAlbumIncluded(key) {
        return albumKeysToHighlight.indexOf(key) >= 0;
    }

    function includeAlbum(songItem) {
        var key = keyForAlbum(songItem.album);
        if (!isAlbumIncluded(key)) {
            albumKeysToHighlight.push(key);
        }
    }
    
    // Highlight songs
    highlightItems(songAnimParams, function(songItem) {
            var song = songItem.song;
            var album = songItem.album;
            var albumOK = (album.primary || includeSecondaryAlbums);
            if (albumOK && song.lead === personKey) {
                includeAlbum(songItem);
                return 1.0;
            } else if (albumOK && includeBackups && song.backups.indexOf(personKey) >= 0) {
                includeAlbum(songItem);
                return 0.7;
            } else {
                return 0.05;
            }
        });
        
    // Highlight albums that have at least one highlighted song
    highlightItems(albumAnimParams, function(albumItem) {
        var key = keyForAlbum(albumItem.album);
        if (isAlbumIncluded(key)) {
            return 1.0;
        } else {
            return 0.1;
        }
    });
}

function highlightSongsAndTitlesForPerson(personKey, songItemFunc) {
    // Flag the case where no songs on an album are highlighted so we can dim that album
    var albumKeysToHighlight = [];

    function isAlbumIncluded(key) {
        return albumKeysToHighlight.indexOf(key) >= 0;
    }

    function includeAlbum(songItem) {
        var key = keyForAlbum(songItem.album);
        if (!isAlbumIncluded(key)) {
            albumKeysToHighlight.push(key);
        }
    }

    // Highlight songs
    highlightItems(songAnimParams, function(songItem) {
            var song = songItem.song;
            var album = songItem.album;
            if (album.primary && song.lead === personKey && songItemFunc(songItem)) {
                includeAlbum(songItem);
                return 1.0;
            } else {
                return 0.05;
            }
        });
        
    // Show the titles of the highlighted songs
    for (var i = 0; i < primaryAlbumCount; i++) {
        var albumItem = albumItems[i];
        var songText = "";
        for (var j = 0; j < albumItem.albumSongItems.length; j++) {
            var songItem = albumItem.albumSongItems[j];
            var song = songItem.song;
            if (song.lead === personKey && songItemFunc(songItem)) {
                songText += song.title + "\n";
            }
        }
        albumItem.songText.content = songText;
        albumItem.songText.fillColor = "#666";
        albumItem.songText.visible = true;
    }
    
    // Highlight albums that have at least one highlighted song
    highlightItems(albumAnimParams, function(albumItem) {
        var key = keyForAlbum(albumItem.album);
        if (isAlbumIncluded(key)) {
            return 1.0;
        } else {
            return 0.1;
        }
    });
}

function resetSongHighlighting() {
    resetAlbumHighlighting();
    resetHighlighting(songAnimParams);
}

function resetSongAndTitleHighlighting() {
    // Reset album and song highlighting
    resetSongHighlighting();
    
    // Clear the titles of the highlighted songs
    for (var i = 0; i < primaryAlbumCount; i++) {
        var albumItem = albumItems[i];
        albumItem.songText.fillColor = "white";
        albumItem.songText.visible = false;
    }
}

function highlightPerson(personKey) {
    highlightItems(personAnimParams, function(personItem) {
            if (personItem.personKey == personKey) {
                return 1.0;
            } else {
                return 0.2;
            }
        });
}

function highlightPersonsForSong(song) {
    highlightItems(personAnimParams, function(personItem) {
            var personKey = personItem.personKey;
            if (song.lead === personKey) {
                return 1.0;
            } else if (song.backups.indexOf(personKey) >= 0) {
                return 0.7;
            } else {
                return 0.2;
            }
        });
}

function resetPersonHighlighting() {
    resetHighlighting(personAnimParams);
}

function highlightLinksForAlbum(album) {
    highlightItems(personLinkAnimParams, function(personLinkItem) {
            if (personLinkItem.album == album) {
                return 1.0;
            } else {
                return 0.1;
            }
        });
}

function highlightLinksForSong(song) {
    highlightItems(personLinkAnimParams, function(personLinkItem) {
            if (personLinkItem.song == song) {
                return 1.0;
            } else {
                return 0.1;
            }
        });
}

function highlightLinksForPerson(personKey) {
    highlightItems(personLinkAnimParams, function(personLinkItem) {
            if (personLinkItem.fromPersonKey === personKey) {
                return 1.0;
            } else {
                return 0.1;
            }
        });
}

function dimLinkHighlighting() {
    highlightItems(personLinkAnimParams, function(personLinkItem) {
            return 0.1;
        });
}

function resetLinkHighlighting() {
    resetHighlighting(personLinkAnimParams);
}

/*
 *
 * SONG GROUPING
 *
 */

function initSortAnimParams() {
    sortAnimParams = {
        animItems: songItems,
        triggerAnimations: false,
        startTime: 0.0,
        endTime: 0.0
    };
}

function processSortAnimations(eventTime, animParams) {
    if (animParams.triggerAnimations) {
        animParams.startTime = eventTime;
        animParams.endTime = eventTime + 0.35;
        animParams.triggerAnimations = false;
    }
    if (animParams.endTime > 0) {
        var progress;
        if (eventTime < animParams.endTime) {
            // Step animations
            progress = (eventTime - animParams.startTime) / (animParams.endTime - animParams.startTime);
        } else {
            // Set all to target
            progress = 1.0;
            // Stop animation
            animParams.startTime = 0;
            animParams.endTime = 0;
        }
        for (var i = 0; i < animParams.animItems.length; i++) {
            var animItem = animParams.animItems[i];
            var item = animItem.item;
            if (item.rotation != animItem.targetRotation) {
                item.rotation = animItem.startRotation + (progress * (animItem.targetRotation - animItem.startRotation));
            }
        }
    }
}

function startSortAnimations() {
    if (enableSortAnim) {
        // Set the flag, which will be handled in the onFrame callback
        sortAnimParams.triggerAnimations = true;
    } else {
        // Otherwise, force all items to the target state immediately
        for (var i = 0; i < sortAnimParams.animItems.length; i++) {
            var animItem = sortAnimParams.animItems[i];
            var item = animItem.item;
            item.rotation = animItem.targetRotation;
        }
        paper.view.draw();
    }
}

function getSongsGroupedByPerson(album) {
    var groupingPersonKeys = ["C", "P", "J", "A"];
    var personSongs = {};
    for (var i = 0; i < groupingPersonKeys.length; i++) {
        var personKey = groupingPersonKeys[i];
        personSongs[personKey] = [];
    }
    for (var i = 0; i < album.songs.length; i++) {
        var song = album.songs[i];
        personSongs[song.lead].push(song);
    }

    var songs = [];
    for (var i = 0; i < groupingPersonKeys.length; i++) {
        var personKey = groupingPersonKeys[i];
        songs = songs.concat(personSongs[personKey]);
    }
    return songs;
}

function getSongIndexByAlbumOrder(album, song) {
    for (var i = 0; i < album.songs.length; i++) {
        var albumSong = album.songs[i];
        if (albumSong == song) {
            return i;
        }
    }
    return -1;
}

function getSongIndexByPerson(album, song) {
    var groupedSongs = getSongsGroupedByPerson(album);
    for (var i = 0; i < groupedSongs.length; i++) {
        var groupedSong = groupedSongs[i];
        if (groupedSong == song) {
            return i;
        }
    }
    return -1;
}

function sortSongs(func) {
    for (var i = 0; i < albumItems.length; i++) {
        var albumItem = albumItems[i];
        var album = albumItem.album;
        var sweep = 360 / album.songs.length;
        for (var j = 0; j < albumItem.albumSongItems.length; j++) {
            var songItem = albumItem.albumSongItems[j];
            var song = songItem.song;
            var songIndex = func(album, song);
            var angle = -90 + (songIndex * sweep);
            songItem.targetRotation = angle;
            songItem.startRotation = songItem.item.rotation;
        }
    }
    startSortAnimations();
}

globals.sortSongsByAlbumOrder = function() {
    sortSongs(getSongIndexByAlbumOrder);
};

globals.sortSongsByPerson = function() {
    sortSongs(getSongIndexByPerson);
};

globals.sortCheckboxClicked = function(cb) {
  if (cb.checked) {
    sortSongs(getSongIndexByPerson);
  } else {
    sortSongs(getSongIndexByAlbumOrder);
  }
};

/*
 *
 * ANIMATION
 *
 */

// TODO: Remove this callback when animation is disabled?
function onFrame(event) {
    if (enableHighlightAnim) {
        for (var i = 0; i < highlightAnimParams.length; i++) {
            var animParams = highlightAnimParams[i];
            processHighlightAnimations(event.time, animParams);
        }
    }

    if (enableSortAnim) {
        processSortAnimations(event.time, sortAnimParams);
    }
}

/*
 *
 * IMAGE LOADING
 *
 */

var hiddenImagesHtml = "";
var imgSuffix = "";
if (window.devicePixelRatio == 2) {
    imgSuffix = "-2x";
}
for (var i = 0; i < albums.length; i++) {
    var cover = albums[i].cover;
    hiddenImagesHtml += '<img class="hidden" id="' + cover + '" src="sc/' + cover + imgSuffix + '.png"></img>';
}
for (var i = 0; i < personKeys.length; i++) {
    var person = persons[personKeys[i]];
    var image = person.name.toLowerCase();
    hiddenImagesHtml += '<img class="hidden" id="' + image + '" src="sc/' + image + imgSuffix + '.png"></img>';
}
document.getElementById("hidden_images").innerHTML = hiddenImagesHtml;

// XXX
//document.ontouchmove = function(e) {e.preventDefault()};

/*
 *
 * MAIN SCRIPT
 *
 */

addAlbums();

addPersonLinks();

addPersons();

addBarCharts();

initHighlightAnimParams();

initSortAnimParams();
