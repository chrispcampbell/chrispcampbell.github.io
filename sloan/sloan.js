/*
 * Sloan-o-graph in D3
 *
 * Copyright (c) 2014-2022 Chris Campbell
 * All rights reserved.
 */

const isTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0

// XXX
const dur = 250

const bgColor = '#222'

const barH = isTouchScreen ? 24 : 16

// const textStyle = 'font-size: 19px; font-family: "Helvetica Neue"; font-weight: 500; cursor: default;'
// const textStyle = 'font-size: 19px; font-family: "Barlow Condensed", sans-serif; font-weight: 500; cursor: default;'
const textStyle =
  // 'font-size: 19px; font-family: "Barlow Semi Condensed", sans-serif; font-weight: 500; cursor: default;'
  'font-size: 19px; cursor: default;'

const vieww = 1200
const viewh = 1150
const viewcx = vieww / 2
const viewcy = 360

const coverSize = 45
const albumRingRadius = 260
const albumTextOffset = 80

const personSize = 90
const personHaloWidth = 5

const persons = {
  A: { name: 'Andrew', color: '#992E2E' },
  C: { name: 'Chris', color: '#2E9999' },
  J: { name: 'Jay', color: '#99992E' },
  P: { name: 'Patrick', color: '#2E992E' },
  G: { name: 'Gregory', color: '#DD1473' }
}

const primaryPersonKeys = ['A', 'J', 'C', 'P']
const personKeys = [...primaryPersonKeys, 'G']
const personRingRadius = 130

const personAngles = {}
const personCenters = {}

const albumItems = []
const songItems = []
const personItems = []
const personLinkItems = []
const gregoryPersonLinkItems = []
const barItems = []

// const enableHighlightAnim = false; //!isTouchScreen;
// const enableMouseHover = true;

// const sortAnimParams = {};
// const enableSortAnim = true;

const primaryAlbumCount = 14
const secondaryAlbumCount = 4

for (let i = 0; i < primaryPersonKeys.length; i++) {
  const personKey = primaryPersonKeys[i]
  const degs = (i * 360) / primaryPersonKeys.length - 90
  const pt = pointOnArc(viewcx, viewcy, personRingRadius, degs)
  personAngles[personKey] = degs
  personCenters[personKey] = pt
}
personAngles['G'] = 0
personCenters['G'] = newPoint(viewcx, viewcy)

// Create groups to hold the layers; text elements always appear
// in front of shapes/images
const svg = d3.select('svg')
const shapeGroup = svg.append('g')
const textGroup = svg.append('g')

// XXX: Used for reset
let bgRect
if (isTouchScreen) {
  bgRect = shapeGroup
    .append('rect')
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', vieww)
    .attr('height', viewh)
    .attr('fill', bgColor)
}

/*
 *
 * MATHS
 *
 */

function newPoint(x, y) {
  return {
    x,
    y
  }
}

function toDegrees(angle) {
  return angle * (180 / Math.PI)
}

function toRadians(angle) {
  return angle * (Math.PI / 180)
}

function pointOnArc(cx, cy, radius, angle) {
  const radians = toRadians(angle)

  // dx:
  //   cos t = dx / r
  //   dx = r * cos t
  // dy:
  //   sin t = dy / r
  //   dy = r * sin t

  const px = cx + radius * Math.cos(radians)
  const py = cy + radius * Math.sin(radians)

  return newPoint(px, py)
}

/*
 *
 * ALBUM ITEMS
 *
 */

function addPieSlice(song, album, cx, cy, baseSize, sweep, angle, songText, albumText, group) {
  let songSize = baseSize + song.seconds / 5
  if (songSize > 210) {
    // XXX: Hack to make "Forty-eight Portraits" less tall
    songSize = 150
  } else if (song.title == 'Before I Do') {
    // XXX: Hack to make "Before I Do" not crowd Smeared
    songSize = 115
  }
  const color = persons[song.lead].color
  const brighterColor = d3.color(color).brighter(2.5)

  const arc = d3
    .arc()
    .startAngle(0)
    .endAngle(toRadians(sweep))
    .innerRadius(0)
    .outerRadius(songSize / 2)

  const slice = group
    .append('path')
    .attr('fill', color)
    .attr('stroke', bgColor)
    .attr('stroke-width', 1)
    .attr('d', arc)
    .attr('transform', `translate(${cx},${cy}),rotate(${angle + 90})`)
    .on('mouseover', function (event) {
      animFill(d3.select(this), brighterColor)
      setTextLines(songText, [song.title])
      setVisible(songText, true)
      setVisible(albumText, true)
      highlightAlbum(album)
      highlightPersonsForSong(song)
      highlightLinksForSong(song)
      event.stopPropagation()
    })
    .on('mouseout', function (event) {
      animFill(d3.select(this), color)
      setVisible(songText, false)
      setVisible(albumText, false)
      resetAlbumHighlighting()
      resetLinkHighlighting()
      resetPersonHighlighting()
      event.stopPropagation()
    })

  const songItem = {
    song,
    album: album,
    slice,
    cx,
    cy,
    color
  }
  songItems.push(songItem)

  return songItem
}

function addPieChart(cx, cy, baseSize, songs, album, songText, albumText, group) {
  const sweep = 360 / songs.length
  const albumSongItems = []
  let angle = -90
  for (let i = 0; i < songs.length; i++) {
    const song = songs[i]
    const songItem = addPieSlice(song, album, cx, cy, baseSize, sweep, angle, songText, albumText, group)
    albumSongItems.push(songItem)
    angle += sweep
  }
  return albumSongItems
}

function addAlbum(i, album) {
  // XXX: Adjust angle so that first and last album are at top
  const degs = (i * 360) / primaryAlbumCount - 90 + 180 / primaryAlbumCount

  const center = pointOnArc(viewcx, viewcy, albumRingRadius, degs)
  const textPt = pointOnArc(viewcx, viewcy, albumRingRadius + albumTextOffset, degs)

  if (i == 0) {
    // XXX: Nudge Smeared to the right
    textPt.x += 40
    textPt.y += 20
  } else if (i == 1) {
    // XXX: TR
    textPt.x += 8
    textPt.y += 26
  } else if (i == 2) {
    // XXX: Move text for OCTA up and to the left
    textPt.x -= 36
    textPt.y -= 38
  } else if (i == 3) {
    // XXX: Move text for NB down and to the left
    textPt.x -= 86
    textPt.y += 70
  } else if (i == 4) {
    // XXX: Move text for BTB down and to the left
    textPt.x -= 80
    textPt.y += 35
  } else if (i == 5) {
    // XXX: Move PT text to avoid overlapping with B-sides
    textPt.x -= 75
    textPt.y += 15
  } else if (i == 6) {
    // XXX: Nudge text for AP
    textPt.x += 6
    textPt.y -= 20
  } else if (i == 7) {
    // XXX: Move text up and to the right for Never Hear
    // so that it doesn't crowd the bar charts
    textPt.x -= 10
    textPt.y -= 20
  } else if (i == 8) {
    // XXX: Parallel Play
    textPt.x += 8
    textPt.y -= 28
  } else if (i == 9) {
    // XXX: XX
    textPt.x += 42
    textPt.y += 12
  } else if (i == 10) {
    // XXX: Commonwealth
    textPt.x += 40
    textPt.y += 52
  } else if (i == 11) {
    // XXX: 12
    textPt.x += 20
    textPt.y += 70
  } else if (i == 12) {
    // XXX: Steady
    textPt.x -= 2
    textPt.y += 86
  } else if (i == 13) {
    // XXX: Based on the Best Seller
    textPt.x -= 38
    textPt.y += 90
  }

  const rightJustify = center.x < viewcx && i !== 14
  addAlbumAtCenterPoint(album, center, textPt, rightJustify)
}

function addAlbumAtCenterPoint(album, center, textPt, rightJustify) {
  // XXX
  const lineH = 22

  // Allow up to 4 song lines per album (for showing singles, etc)
  const songText = textGroup
    .append('text')
    .attr('x', textPt.x)
    .attr('y', textPt.y)
    .attr('fill', 'white')
    .attr('text-anchor', rightJustify ? 'end' : 'start')
    .attr('pointer-events', 'none')
    .attr('style', textStyle)
    .style('opacity', 0)
  for (let i = 0; i < 4; i++) {
    const tspan = songText.append('tspan').attr('x', textPt.x)
    tspan.attr('y', textPt.y + i * lineH)
  }
  setVisible(songText, false)

  const albumText = textGroup
    .append('text')
    .attr('x', textPt.x)
    .attr('y', textPt.y + lineH)
    .attr('fill', '#bbb')
    .attr('text-anchor', rightJustify ? 'end' : 'start')
    .attr('pointer-events', 'none')
    .attr('style', textStyle)
    .style('opacity', 0)
  albumText.append('tspan').attr('x', textPt.x).text(album.title)
  albumText.append('tspan').attr('x', textPt.x).attr('dy', lineH).text(album.year)
  setVisible(albumText, false)

  const group = shapeGroup.append('g')

  const songs = getSongsGroupedByPerson(album)
  const albumSongItems = addPieChart(center.x, center.y, coverSize, songs, album, songText, albumText, group)

  // Add a transparent circle and use that for hit testing, otherwise
  // transparent areas of the image will trigger events
  group
    .append('circle')
    .attr('cx', center.x)
    .attr('cy', center.y)
    .attr('r', coverSize / 2 + 1)
    .style('fill', bgColor)
    .on('mouseover', function (event) {
      highlightAlbum(album)
      highlightLinksForAlbum(album)
      setVisible(songText, false)
      setVisible(albumText, true)
      event.stopPropagation()
    })
    .on('mouseout', function (event) {
      resetAlbumHighlighting()
      resetLinkHighlighting()
      setVisible(songText, false)
      setVisible(albumText, false)
      event.stopPropagation()
    })

  group
    .append('image')
    .attr('x', center.x - coverSize / 2)
    .attr('y', center.y - coverSize / 2)
    .attr('width', coverSize)
    .attr('height', coverSize)
    .attr('pointer-events', 'none')
    .attr('xlink:href', `sc/${album.cover}-2x.png`)

  const pieItems = []
  for (let i = 0; i < albumSongItems.length; i++) {
    const songItem = albumSongItems[i]
    pieItems.push(songItem.item)
  }

  const albumItem = {
    album,
    songText,
    albumText,
    albumSongItems,
    group
  }
  albumItems.push(albumItem)
}

function addAlbums() {
  for (let i = 0; i < primaryAlbumCount; i++) {
    const album = albums[i]
    album.primary = true
    addAlbum(i, album)
  }

  // XXX
  for (let i = primaryAlbumCount; i < primaryAlbumCount + secondaryAlbumCount; i++) {
    const album = albums[i]
    album.primary = false
  }

  const cl = 250
  const cr = vieww - cl
  const ct = 150
  const cb = 560

  const tl = cl - 30
  const tr = cr + 30
  const tt = 214
  const tb = 630

  const pep = albums[primaryAlbumCount]
  const hnr = albums[primaryAlbumCount + 1]
  const bs1 = albums[primaryAlbumCount + 2]
  const bs2 = albums[primaryAlbumCount + 3]
  addAlbumAtCenterPoint(pep, newPoint(cr, ct), newPoint(tr, tt), true)
  addAlbumAtCenterPoint(bs1, newPoint(cr, cb), newPoint(tr, tb), true)
  addAlbumAtCenterPoint(bs2, newPoint(cl, cb), newPoint(tl, tb), false)
  addAlbumAtCenterPoint(hnr, newPoint(cl, ct), newPoint(tl, tt), false)

  setSecondaryAlbumsVisible(false)
}

function setSecondaryAlbumsVisible(visible) {
  for (let i = 0; i < secondaryAlbumCount; i++) {
    const albumItem = albumItems[primaryAlbumCount + i]
    albumItem.group.attr('visibility', visible ? 'unset' : 'hidden')
  }
}

function setGregoryVisible(visible) {
  personItems[4].blackoutCircle.attr('visibility', visible ? 'unset' : 'hidden')
  personItems[4].group.attr('visibility', visible ? 'unset' : 'hidden')
  for (let i = 0; i < gregoryPersonLinkItems.length; i++) {
    const personLinkItem = gregoryPersonLinkItems[i]
    personLinkItem.line.attr('visibility', visible ? 'unset' : 'hidden')
  }
}

// Used by index.html
function showSecondaryAlbums() {
  setSecondaryAlbumsVisible(true)
}
function hideSecondaryAlbums() {
  setSecondaryAlbumsVisible(false)
}
function secondaryAlbumCheckboxClicked(cb) {
  setSecondaryAlbumsVisible(cb.checked)
}
function gregoryCheckboxClicked(cb) {
  setGregoryVisible(cb.checked)
}

/*
 *
 * PERSON ITEMS
 *
 */

function addPerson(cx, cy, personKey) {
  const person = persons[personKey]

  let pos
  let anchor
  if (personKey === 'P' || personKey === 'C') {
    pos = newPoint(cx - 10, cy + 64)
    anchor = 'end'
  } else {
    pos = newPoint(cx + 10, cy - 54)
    anchor = 'start'
  }

  const nameText = textGroup
    .append('text')
    .attr('x', pos.x)
    .attr('y', pos.y)
    .attr('fill', 'white')
    .attr('text-anchor', anchor)
    .attr('style', textStyle)
    .style('opacity', 0)
    .text(person.name)

  // Add an opaque circle that blacks out links even when person is dimmed
  const personHaloRadius = personSize / 2 + personHaloWidth
  const blackoutCircle = shapeGroup
    .append('circle')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('r', personHaloRadius)
    .attr('fill', bgColor)

  const group = shapeGroup.append('g')

  const circle = group
    .append('circle')
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('r', personHaloRadius)
    .style('fill', person.color)
    // Highlight pie slices and links when hovering over person
    .on('mouseover', function (event) {
      highlightSongsForPerson(personKey, true, true)
      highlightLinksForPerson(personKey)
      highlightPerson(personKey)
      animOpacity(nameText, 1)
      event.stopPropagation()
    })
    .on('mouseout', function (event) {
      resetSongHighlighting()
      resetLinkHighlighting()
      resetPersonHighlighting()
      animOpacity(nameText, 0)
      event.stopPropagation()
    })

  group
    .append('image')
    .attr('x', cx - personSize / 2)
    .attr('y', cy - personSize / 2)
    .attr('width', personSize)
    .attr('height', personSize)
    .attr('pointer-events', 'none')
    .attr('xlink:href', `sc/${person.name.toLowerCase()}-2x.png`)

  const personItem = {
    personKey: personKey,
    person: person,
    nameText,
    blackoutCircle,
    group
  }
  personItems.push(personItem)
}

function addPersons() {
  for (let i = 0; i < primaryPersonKeys.length; i++) {
    const personKey = primaryPersonKeys[i]
    const pt = personCenters[personKey]
    addPerson(pt.x, pt.y, personKey)
  }

  // Add Gregory in the middle of the ring
  addPerson(viewcx, viewcy, 'G')
  // setGregoryVisible(false)
}

/*
 *
 * PERSON LINK ITEMS
 *
 */

function getOtherPersonKeys(personKey) {
  const keys = []
  for (let i = 0; i < personKeys.length; i++) {
    const otherPersonKey = personKeys[i]
    if (personKey !== otherPersonKey) {
      keys.push(otherPersonKey)
    }
  }
  return keys
}

function getBackupSongItems(backupPersonKey, leadPersonKey) {
  const backupSongItems = []
  for (let i = 0; i < songItems.length; i++) {
    const songItem = songItems[i]
    const song = songItem.song
    if (song.lead === leadPersonKey && song.backups.indexOf(backupPersonKey) >= 0) {
      backupSongItems.push(songItem)
    }
  }
  return backupSongItems
}

function addPersonLink(song, album, fromPersonKey, toPersonKey, handleRadius) {
  const fromPerson = persons[fromPersonKey]

  const fromPersonCenter = personCenters[fromPersonKey]
  const toPersonCenter = personCenters[toPersonKey]

  let handle
  if (fromPersonCenter.x == toPersonCenter.x) {
    if (fromPersonCenter.y < toPersonCenter.y) {
      // Link goes from top to bottom; curve to the right
      handle = newPoint(fromPersonCenter.x + handleRadius, viewcy)
    } else {
      // Link goes from bottom to top; curve to the left
      handle = newPoint(fromPersonCenter.x - handleRadius, viewcy)
    }
  } else if (fromPersonCenter.y == toPersonCenter.y) {
    if (fromPersonCenter.x < toPersonCenter.x) {
      // Link goes from left to right; curve to the top
      handle = newPoint(viewcx, fromPersonCenter.y - handleRadius)
    } else {
      // Link goes from right to left; curve to the bottom
      handle = newPoint(viewcx, fromPersonCenter.y + handleRadius)
    }
  } else {
    // Persons are "adjacent" on the ring
    let fromPersonAngle = personAngles[fromPersonKey]
    let toPersonAngle = personAngles[toPersonKey]
    // XXX: Hack to make links between A and P convex
    if (fromPersonAngle < 0 && toPersonAngle > 0) {
      fromPersonAngle += 360
    }
    if (fromPersonAngle > 0 && toPersonAngle < 0) {
      toPersonAngle += 360
    }
    // if (fromPersonKey === 'G') {
    //   fromPersonAngle = 50
    //   toPersonAngle = 50
    // }
    const midAngle = fromPersonAngle + (toPersonAngle - fromPersonAngle) / 2

    const fromPersonIndex = personKeys.indexOf(fromPersonKey)
    const toPersonIndex = personKeys.indexOf(toPersonKey)
    const indexDiff = toPersonIndex - fromPersonIndex
    let radius
    if (indexDiff == 1 || indexDiff == -3) {
      // Link is in clockwise direction; curve to the outside
      radius = personRingRadius + handleRadius
    } else {
      // Link is in counterclockwise direction; curve to the inside
      radius = personRingRadius - handleRadius
    }
    handle = pointOnArc(viewcx, viewcy, radius, midAngle)
  }

  const path = d3.path()
  path.moveTo(fromPersonCenter.x, fromPersonCenter.y)
  path.quadraticCurveTo(handle.x, handle.y, toPersonCenter.x, toPersonCenter.y)

  const line = shapeGroup
    .append('path')
    .attr('fill', 'none')
    .attr('stroke', fromPerson.color)
    .attr('stroke-width', 1)
    .attr('pointer-events', 'none')
    .attr('d', path.toString())

  const personLinkItem = {
    song: song,
    album: album,
    fromPersonKey: fromPersonKey,
    fromPerson: fromPerson,
    line
  }
  personLinkItems.push(personLinkItem)
  if (fromPersonKey === 'G') {
    gregoryPersonLinkItems.push(personLinkItem)
  }
}

function addPersonLinks() {
  // Add links for the main four
  for (let i = 0; i < primaryPersonKeys.length; i++) {
    const fromPersonKey = primaryPersonKeys[i]
    const toPersonKeys = getOtherPersonKeys(fromPersonKey)
    for (let j = 0; j < toPersonKeys.length; j++) {
      const toPersonKey = toPersonKeys[j]
      const backupSongItems = getBackupSongItems(fromPersonKey, toPersonKey)
      for (let k = 0; k < backupSongItems.length; k++) {
        const songItem = backupSongItems[k]
        const song = songItem.song
        const album = songItem.album
        addPersonLink(song, album, fromPersonKey, toPersonKey, (k + 1) * 4)
      }
    }
  }

  // Add links for Gregory.  Add one link from Gregory to another person for each
  // song they are the primary writer/singer for, for all albums 2008 or later.
  // (We will assume that he helped on every song from Parallel Play onwards.
  // This probably isn't entirely accurate, but it's close enough.)
  let gregoryRadius = 0
  for (let i = 0; i < albums.length; i++) {
    const album = albums[i]
    const year = yearForAlbum(album)

    // Only process albums from 2008 or later
    if (year >= 2008) {
      for (let j = 0; j < album.songs.length; j++) {
        const song = album.songs[j]
        const leadPersonKey = song.lead

        // Add a link from Gregory to the primary songwriter
        const radius = (gregoryRadius -= 4)
        addPersonLink(song, album, 'G', leadPersonKey, radius)
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
  const person = persons[personKey]
  const brighterColor = d3.color(person.color).brighter(2.5)

  const bar = shapeGroup
    .append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('width', w)
    .attr('height', h)
    .attr('fill', person.color)
    .on('mouseover', function (event) {
      animFill(d3.select(this), brighterColor)
      highlightPerson(personKey)
      dimLinkHighlighting()
      enterFunc(personKey)
      event.stopPropagation()
    })
    .on('mouseout', function (event) {
      animFill(d3.select(this), person.color)
      resetPersonHighlighting()
      resetLinkHighlighting()
      exitFunc(personKey)
      event.stopPropagation()
    })

  textGroup
    .append('text')
    .attr('x', x + 9)
    .attr('y', y + h - (isTouchScreen ? 6 : 2))
    .attr('fill', bgColor)
    .attr('style', textStyle)
    .attr('text-anchor', 'middle')
    .attr('pointer-events', 'none')
    .style('font-size', '17px')
    .text(personKey)

  barItems.push({
    bar,
    color: person.color
  })
}

function addBarChart(title, x, y, w, h, chartItems, maxValue, label0, label1, label2, enterFunc, exitFunc) {
  const barPadY = (h - chartItems.length * barH) / (chartItems.length + 1)

  const barX = x + 1
  let barY = y + barPadY

  textGroup
    .append('text')
    .attr('x', x)
    .attr('y', y - 6)
    .attr('fill', '#ddd')
    .attr('style', textStyle)
    .style('font-size', '18px')
    .text(title)

  const axisColor = 'white'
  const axisOpacity = 0.3
  shapeGroup
    .append('line')
    .attr('x1', x)
    .attr('y1', y)
    .attr('x2', x)
    .attr('y2', y + h)
    .attr('stroke', axisColor)
    .attr('opacity', axisOpacity)
    .attr('pointer-events', 'none')
  shapeGroup
    .append('line')
    .attr('x1', x)
    .attr('y1', y + h)
    .attr('x2', x + w)
    .attr('y2', y + h)
    .attr('stroke', axisColor)
    .attr('opacity', axisOpacity)
    .attr('pointer-events', 'none')

  const labelColor = '#888'
  const labelY = y + h + 20

  function addLabel(content, labelX) {
    textGroup
      .append('text')
      .attr('x', labelX)
      .attr('y', labelY)
      .attr('fill', labelColor)
      .attr('text-anchor', 'middle')
      .attr('pointer-events', 'none')
      .attr('style', textStyle)
      .text(content)
  }
  addLabel(label0, x)
  addLabel(label1, x + w / 2)
  addLabel(label2, x + w)

  // Sort items in descending order
  chartItems.sort(function (a, b) {
    return b.value - a.value
  })
  for (let i = 0; i < chartItems.length; i++) {
    const chartItem = chartItems[i]
    const barW = w * (chartItem.value / maxValue)
    addBar(barX, barY, barW, barH, chartItem.personKey, enterFunc, exitFunc)
    barY += barH + barPadY
  }
}

function addBarCharts() {
  const chartW = 170
  const chartH = barH * 4 + 28

  const firstX = viewcx - chartW * 2.2
  const middleX = viewcx - chartW * 0.6
  const lastX = viewcx + chartW * 0.9

  const firstRowY = 750
  const secondRowY = firstRowY + chartH + (isTouchScreen ? 80 : 72)

  function getSongsForPerson(personKey) {
    const songs = []
    for (let i = 0; i < primaryAlbumCount; i++) {
      const album = albums[i]
      for (let j = 0; j < album.songs.length; j++) {
        const song = album.songs[j]
        if (song.lead === personKey) {
          songs.push(song)
        }
      }
    }
    return songs
  }

  function getChartItems(func) {
    const chartItems = []
    for (let i = 0; i < personKeys.length; i++) {
      const personKey = personKeys[i]
      const chartItem = {
        personKey: personKey,
        value: func(personKey)
      }
      chartItems.push(chartItem)
    }
    return chartItems
  }

  // Singles / total songs
  function getSingleToTotalRatio(personKey) {
    const songs = getSongsForPerson(personKey)
    let totalSingles = 0
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i]
      if (song.single) {
        totalSingles++
      }
    }
    return totalSingles / songs.length
  }
  addBarChart(
    '# singles vs songs written',
    firstX,
    firstRowY,
    chartW,
    chartH,
    getChartItems(getSingleToTotalRatio),
    0.4,
    '0%',
    '20%',
    '40%',
    function (personKey) {
      highlightSongsAndTitlesForPerson(personKey, function (songItem) {
        return songItem.song.single
      })
    },
    function () {
      resetSongAndTitleHighlighting()
    }
  )

  // First song on album
  function getFirstSongCount(personKey) {
    let count = 0
    for (let i = 0; i < primaryAlbumCount; i++) {
      const albumItem = albumItems[i]
      const album = albumItem.album
      const firstSong = album.songs[0]
      if (firstSong.lead === personKey) {
        count++
      }
    }
    return count
  }
  addBarChart(
    'First song on album',
    middleX,
    firstRowY,
    chartW,
    chartH,
    getChartItems(getFirstSongCount),
    10,
    '0',
    '5',
    '10',
    function (personKey) {
      highlightSongsAndTitlesForPerson(personKey, function (songItem) {
        return songItem.album.songs[0] == songItem.song
      })
    },
    function () {
      resetSongAndTitleHighlighting()
    }
  )

  // Last song on album
  function getLastSongCount(personKey) {
    let count = 0
    for (let i = 0; i < primaryAlbumCount; i++) {
      const albumItem = albumItems[i]
      const album = albumItem.album
      const lastSong = album.songs[album.songs.length - 1]
      if (lastSong.lead === personKey) {
        count++
      }
    }
    return count
  }
  addBarChart(
    'Last song on album',
    lastX,
    firstRowY,
    chartW,
    chartH,
    getChartItems(getLastSongCount),
    10,
    '0',
    '5',
    '10',
    function (personKey) {
      highlightSongsAndTitlesForPerson(personKey, function (songItem) {
        return songItem.album.songs[songItem.album.songs.length - 1] == songItem.song
      })
    },
    function () {
      resetSongAndTitleHighlighting()
    }
  )

  // Total songs
  function getTotalSongs(personKey) {
    const songs = getSongsForPerson(personKey)
    return songs.length
  }
  addBarChart(
    'Total songs',
    firstX,
    secondRowY,
    chartW,
    chartH,
    getChartItems(getTotalSongs),
    100,
    '0',
    '50',
    '100',
    function (personKey) {
      highlightSongsForPerson(personKey, false, false)
    },
    function () {
      resetSongHighlighting()
    }
  )

  // Average song length
  function getAverageSongLength(personKey) {
    const songs = getSongsForPerson(personKey)
    let totalSeconds = 0
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i]
      totalSeconds += song.seconds
    }
    return totalSeconds / songs.length
  }
  addBarChart(
    'Average song length',
    middleX,
    secondRowY,
    chartW,
    chartH,
    getChartItems(getAverageSongLength),
    240,
    '0:00',
    '2:00',
    '4:00',
    function (personKey) {
      highlightSongsForPerson(personKey, false, false)
    },
    function () {
      resetSongHighlighting()
    }
  )

  // Average song title word count
  function getAverageTitleWordCount(personKey) {
    const songs = getSongsForPerson(personKey)
    let totalWords = 0
    for (let i = 0; i < songs.length; i++) {
      const song = songs[i]
      totalWords += song.title.split(' ').length
    }
    return totalWords / songs.length
  }
  addBarChart(
    'Average words per song title',
    lastX,
    secondRowY,
    chartW,
    chartH,
    getChartItems(getAverageTitleWordCount),
    4,
    '0',
    '2',
    '4',
    function (personKey) {
      highlightSongsForPerson(personKey, false, false)
    },
    function () {
      resetSongHighlighting()
    }
  )
}

/*
 *
 * HIGHLIGHTING
 *
 */

function animOpacity(elem, opacity) {
  // TODO: Check animationsEnabled flag
  elem.transition('opacity').duration(dur).style('opacity', opacity)
}

function animFill(elem, color) {
  // TODO: Check animationsEnabled flag
  elem.transition('fill').duration(dur).attr('fill', color)
}

function setTextLines(elem, lines) {
  // XXX
  const node = elem.node()
  for (let i = 0; i < 4; i++) {
    const line = i < lines.length ? lines[i] : ''
    d3.select(node.childNodes[i]).text(line)
  }
}

function setVisible(elem, visible) {
  // TODO: Consider using visibility instead sometimes?
  // elem.attr('visibility', visible ? 'unset' : 'hidden')
  animOpacity(elem, visible ? 1 : 0)
}

function highlightAlbum(album) {
  for (const albumItem of albumItems) {
    const opacity = albumItem.album === album ? 1 : 0.1
    animOpacity(albumItem.group, opacity)
  }

  // Dim Gregory when hovering over albums prior to 2008
  const year = yearForAlbum(album)
  const gregoryItem = personItems[4]
  if (year < 2008) {
    animOpacity(gregoryItem.group, 0.1)
  }
}

function resetAlbumHighlighting() {
  for (const albumItem of albumItems) {
    animOpacity(albumItem.group, 1)
  }

  // Restore Gregory's opacity when resetting album highlighting
  const gregoryItem = personItems[4]
  animOpacity(gregoryItem.group, 1)
}

function keyForAlbum(album) {
  return album.title + '::' + album.year
}

function yearForAlbum(album) {
  let yearStr = album.year
  if (yearStr.startsWith('ca. ')) {
    yearStr = yearStr.substring(4, 8)
  }
  return parseInt(yearStr)
}

function highlightSongsForPerson(personKey, includeBackups, includeSecondaryAlbums) {
  // Flag the case where no songs on an album are highlighted so we can dim that album
  const albumKeysToHighlight = []

  function isAlbumIncluded(key) {
    return albumKeysToHighlight.indexOf(key) >= 0
  }

  function includeAlbum(songItem) {
    const key = keyForAlbum(songItem.album)
    if (!isAlbumIncluded(key)) {
      albumKeysToHighlight.push(key)
    }
  }

  // Highlight songs
  for (const songItem of songItems) {
    const song = songItem.song
    const album = songItem.album
    const albumOK = album.primary || includeSecondaryAlbums
    let opacity
    if (albumOK && song.lead === personKey) {
      includeAlbum(songItem)
      opacity = 1.0
    } else if (albumOK && includeBackups && song.backups.indexOf(personKey) >= 0) {
      includeAlbum(songItem)
      opacity = 0.7
    } else {
      opacity = 0.05
    }
    animOpacity(songItem.slice, opacity)
  }

  // Highlight albums that have at least one highlighted song
  for (const albumItem of albumItems) {
    const key = keyForAlbum(albumItem.album)
    const opacity = isAlbumIncluded(key) ? 1 : 0.1
    animOpacity(albumItem.group, opacity)
  }
}

function highlightSongsAndTitlesForPerson(personKey, songItemFunc) {
  // Flag the case where no songs on an album are highlighted so we can dim that album
  const albumKeysToHighlight = []

  function isAlbumIncluded(key) {
    return albumKeysToHighlight.indexOf(key) >= 0
  }

  function includeAlbum(songItem) {
    const key = keyForAlbum(songItem.album)
    if (!isAlbumIncluded(key)) {
      albumKeysToHighlight.push(key)
    }
  }

  // Highlight songs
  for (const songItem of songItems) {
    const song = songItem.song
    const album = songItem.album
    let opacity
    if (album.primary && song.lead === personKey && songItemFunc(songItem)) {
      includeAlbum(songItem)
      opacity = 1.0
    } else {
      opacity = 0.05
    }
    animOpacity(songItem.slice, opacity)
  }

  // Show the titles of the highlighted songs
  for (let i = 0; i < primaryAlbumCount; i++) {
    const albumItem = albumItems[i]
    const songTextLines = []
    for (let j = 0; j < albumItem.albumSongItems.length; j++) {
      const songItem = albumItem.albumSongItems[j]
      const song = songItem.song
      if (song.lead === personKey && songItemFunc(songItem)) {
        songTextLines.push(song.title)
      }
    }
    setTextLines(albumItem.songText, songTextLines)
    setVisible(albumItem.songText, true)
  }

  // Highlight albums that have at least one highlighted song
  for (const albumItem of albumItems) {
    const key = keyForAlbum(albumItem.album)
    const opacity = isAlbumIncluded(key) ? 1 : 0.1
    animOpacity(albumItem.group, opacity)
  }
}

function resetSongHighlighting() {
  resetAlbumHighlighting()
  for (const songItem of songItems) {
    animOpacity(songItem.slice, 1)
  }
}

function resetSongAndTitleHighlighting() {
  // Reset album and song highlighting
  resetSongHighlighting()

  // Clear the titles of the highlighted songs
  for (let i = 0; i < primaryAlbumCount; i++) {
    const albumItem = albumItems[i]
    setVisible(albumItem.songText, false)
  }
}

function highlightPerson(personKey) {
  for (const personItem of personItems) {
    const opacity = personItem.personKey === personKey ? 1.0 : 0.2
    animOpacity(personItem.group, opacity)
  }
}

function highlightPersonsForSong(song) {
  for (const personItem of personItems) {
    const personKey = personItem.personKey
    let opacity
    if (song.lead === personKey) {
      opacity = 1
    } else if (song.backups.indexOf(personKey) >= 0) {
      opacity = 0.7
    } else {
      opacity = 0.2
    }
    animOpacity(personItem.group, opacity)
  }
}

function resetPersonHighlighting() {
  for (const personItem of personItems) {
    animOpacity(personItem.group, 1)
  }
}

function highlightLinksForAlbum(album) {
  for (const personLinkItem of personLinkItems) {
    const opacity = personLinkItem.album === album ? 1.0 : 0.1
    animOpacity(personLinkItem.line, opacity)
  }
}

function highlightLinksForSong(song) {
  for (const personLinkItem of personLinkItems) {
    const opacity = personLinkItem.song === song ? 1.0 : 0.1
    animOpacity(personLinkItem.line, opacity)
  }
}

function highlightLinksForPerson(personKey) {
  for (const personLinkItem of personLinkItems) {
    const opacity = personLinkItem.fromPersonKey === personKey ? 1.0 : 0.1
    animOpacity(personLinkItem.line, opacity)
  }
}

function dimLinkHighlighting() {
  for (const personLinkItem of personLinkItems) {
    animOpacity(personLinkItem.line, 0.1)
  }
}

function resetLinkHighlighting() {
  for (const personLinkItem of personLinkItems) {
    animOpacity(personLinkItem.line, 1)
  }
}

function resetAll() {
  // This resets album highlighting too
  resetSongAndTitleHighlighting()
  resetLinkHighlighting()
  resetPersonHighlighting()

  // Reset other text/fill state
  for (let i = 0; i < personItems.length; i++) {
    const personItem = personItems[i]
    animOpacity(personItem.nameText, 0)
  }
  for (let i = 0; i < albumItems.length; i++) {
    const albumItem = albumItems[i]
    setVisible(albumItem.albumText, false)
    setVisible(albumItem.songText, false)
  }
  for (let i = 0; i < songItems.length; i++) {
    const songItem = songItems[i]
    animFill(songItem.slice, songItem.color)
  }
  for (let i = 0; i < barItems.length; i++) {
    const barItem = barItems[i]
    animFill(barItem.bar, barItem.color)
  }
}

/*
 *
 * SONG GROUPING
 *
 */

function getSongsGroupedByPerson(album) {
  const groupingPersonKeys = ['C', 'P', 'J', 'A']
  const personSongs = {}
  for (let i = 0; i < groupingPersonKeys.length; i++) {
    const personKey = groupingPersonKeys[i]
    personSongs[personKey] = []
  }
  for (let i = 0; i < album.songs.length; i++) {
    const song = album.songs[i]
    personSongs[song.lead].push(song)
  }

  let songs = []
  for (let i = 0; i < groupingPersonKeys.length; i++) {
    const personKey = groupingPersonKeys[i]
    songs = songs.concat(personSongs[personKey])
  }
  return songs
}

function getSongIndexByAlbumOrder(album, song) {
  for (let i = 0; i < album.songs.length; i++) {
    const albumSong = album.songs[i]
    if (albumSong == song) {
      return i
    }
  }
  return -1
}

function getSongIndexByPerson(album, song) {
  const groupedSongs = getSongsGroupedByPerson(album)
  for (let i = 0; i < groupedSongs.length; i++) {
    const groupedSong = groupedSongs[i]
    if (groupedSong == song) {
      return i
    }
  }
  return -1
}

function sortSongs(func) {
  for (let i = 0; i < albumItems.length; i++) {
    const albumItem = albumItems[i]
    const album = albumItem.album
    const sweep = 360 / album.songs.length
    for (let j = 0; j < albumItem.albumSongItems.length; j++) {
      const songItem = albumItem.albumSongItems[j]
      const song = songItem.song
      const songIndex = func(album, song)
      const angle = -90 + songIndex * sweep
      const cx = songItem.cx
      const cy = songItem.cy
      songItem.slice
        .transition('rotation')
        .duration(dur * 4)
        .attr('transform', `translate(${cx},${cy}),rotate(${angle + 90})`)
    }
  }
}

// Used by index.html
function sortSongsByAlbumOrder() {
  sortSongs(getSongIndexByAlbumOrder)
}
function sortSongsByPerson() {
  sortSongs(getSongIndexByPerson)
}
function sortCheckboxClicked(cb) {
  if (cb.checked) {
    sortSongs(getSongIndexByPerson)
  } else {
    sortSongs(getSongIndexByAlbumOrder)
  }
}

/*
 *
 * MAIN SCRIPT
 *
 */

// Add the elements
addAlbums()
addPersonLinks()
addPersons()
addBarCharts()

let currentElem

if (isTouchScreen) {
  // Reset everything when background is clicked
  bgRect.on('click', function () {
    resetAll()
  })
  // XXX: Hack to redispatch hover events when dragging finger
  // around on touch screen
  svg.on('touchmove', function (event) {
    const x = event.pageX
    const y = event.pageY
    const elem = document.elementFromPoint(x, y)
    if (elem !== currentElem) {
      if (currentElem) {
        const sel = d3.select(currentElem)
        sel.node().dispatchEvent(new Event('mouseout'))
      }
      if (elem) {
        const sel = d3.select(elem)
        sel.node().dispatchEvent(new Event('mouseover'))
      }
      currentElem = elem
    }
  })
}
