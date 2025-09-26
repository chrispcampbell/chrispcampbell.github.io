import json

def quote(x):
  return "\"%s\"" % x

def person(initial):
  return {
    'A': "andrew",
    'C': "chris",
    'J': "jay",
    'P': "patrick"
  }[initial]

class Song:
  def __init__(self, title, time, lead, backups, single):
    self.title = title
    self.time = time
    self.lead = lead
    self.backups = backups
    self.single = single

  def __str__(self):
    return '  %s %s' % (self.title, self.time)

  def time_in_seconds(self):
    time_parts = self.time.split(":")
    return (int(time_parts[0]) * 60) + int(time_parts[1])

  def toJSON(self):
    return dict(title=self.title, time=self.time, seconds=self.time_in_seconds(), lead=self.lead, backups=self.backups, single=self.single) 

class Album:
  def __init__(self, title, year, cover, songs):
    self.title = title
    self.year = year
    self.cover = cover
    self.songs = songs

  def __str__(self):
    return '%s (%s)' % (self.title, self.year)

  def toJSON(self):
    return dict(title=self.title, year=self.year, cover=self.cover, songs=self.songs) 

  def songs_by_lead(self):
    map = {}
    for song in self.songs:
      list = map.setdefault(song.lead, [])
      list.append(song)
    return map

class ComplexEncoder(json.JSONEncoder):
  def default(self, obj):
    if hasattr(obj,'toJSON'):
      return obj.toJSON()
    else:
      return json.JSONEncoder.default(self, obj)

with open("albums.txt") as f:
  lines = f.readlines()
  lines = [x.strip('\n') for x in lines] 

#print lines

albums = []

while len(lines) > 2:
  album_title = lines.pop(0)
  album_year = lines.pop(0)
  album_cover = lines.pop(0)
  #print album_title + " (" + album_year + ")"

  songs = []

  while len(lines) >= 2 and len(lines[1]) > 0:
    lines.pop(0) # blank line
    song_title = lines.pop(0)
    song_time = lines.pop(0)
    song_people = lines.pop(0).split(',')
    song_lead = song_people[0]
    song_backups = song_people[1:]
    song_is_single = song_title.startswith("*")
    if song_is_single:
      song_title = song_title[1:]
    #print song_title + " " + song_time
    song = Song(song_title, song_time, song_lead, song_backups, song_is_single)
    songs.append(song)

  album = Album(album_title, album_year, album_cover, songs)

  albums.append(album)

  if len(lines) >= 2:
    lines.pop(0) # blank line
    lines.pop(0) # blank line

def dumpProcessing():
  print "  albums = new Album[%d];" % len(albums)

  for ai, album in enumerate(albums):
    print "  {"
    print "    Song[] songs = new Song[%d];" % len(album.songs)
    for si, song in enumerate(album.songs):
        time_parts = song.time.split(":")
        seconds = (int(time_parts[0]) * 60) + int(time_parts[1])
        lead = person(song.lead)
        backups = map(person, song.backups)
        backups = ",".join(backups)
        print "    songs[%d] = new Song(\"%s\", %d, %s, new String[] { %s });" % (si, song.title, seconds, lead, backups)
    print "    albums[%d] = new Album(\"%s\", \"%s\", \"%s\", songs);" % (ai, album.title, album.year, album.cover)
    print "  }"
    print

print "var albums = " + json.dumps(albums, sort_keys=True, indent=2, separators=(',', ': '), cls=ComplexEncoder)

  #songs_by_lead = album.songs_by_lead()
  #for key in songs_by_lead.keys():
  #  print "  %s" % key
  #  for song in songs_by_lead[key]:
  #    print "    %s -- %s" % (song.title, song.time)
