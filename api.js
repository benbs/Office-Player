var google = require('googleapis');
var youtube = google.youtube('v3');
var _und = require("underscore");

var Song = require("./Song.js");

var api = {
  io: null,
  playlist: null,
  key: "AIzaSyDpf1zpnEIu2otoq_jERitTBXn-O3yJ9bg",
  initialize: function(io, playlist) {
    this.io = io;
    this.playlist = playlist;
  },
  addSong: function(yId, callback) {
    var io = this.io;
    var playlist = this.playlist;
    if (yId && yId.length == 11 && !playlist.find(function(song){return song.id == yId})) {
      youtube.videos.list({
        id: yId,
        part: "snippet,contentDetails",
        type: "video",
        auth: this.key
      }, (function (err, response) {
        if (!err && response.items.length) {
          var song = new Song(response.items[0]);
          youtube.search.list({
            part: "snippet",
            type: "video",
            auth: this.key,
            relatedToVideoId: yId,
            maxResults: 10
          }, (function(err, relatedResp) {
            if (!err && relatedResp.items.length) {
              song.set({relatedSongs: relatedResp.items});
              playlist.add(song);
              playlist.length == 1 && io.to("players").emit("nowPlaying", song);
              io.to("clients").emit('loadSong', this.getSong(yId));
              io.to("clients").emit('nowPlaying', this.nowPlaying());
              console.log("added song");
              callback && typeof callback == "function" && callback.apply()
            }
          }).bind(this))
        }
      }).bind(this))
    }
    else {
      console.log("duplicated song or another error");
    }
  },
  addPlaylist: function(pId) {
    youtube.playlistItems.list({
      playlistId: pId,
      part: "snippet",
      auth: this.key,
      maxResults: 50
    }, (function (err, response) {
      _und(response.items).each((function(item) {
        this.addSong(item.snippet.resourceId.videoId)
      }).bind(this));
      this.io.to("clients").emit('getPlaylist', this.getPlaylist())
    }).bind(this))
  },
  deleteSong: function(songId) {
    var io = this.io;
    var playlist = this.playlist;
    var song = playlist.find(function(song){return song.id == songId});
    playlist.remove(song);
    io.to("clients").emit("getPlaylist", this.getPlaylist())
  },
  clearPlaylist: function() {
    this.playlist.reset();
    this.io.to("clients").emit("getPlaylist", this.getPlaylist());
  },
  getPlaylist: function (data) {
    if (data) {
      return this.playlist
    }
    else {
     return this.playlist.models.map(function(song) {
       return song.id
     });
    }
  },
  getSong: function(songId) {
    return this.playlist.get(songId)
  },
  getSongs: function(songs) {
    return this.playlist.filter(function(song) {
      return _und(songs).contains(song.id);
    })
  },
  nowPlaying: function () {
    if (this.playlist.nowPlaying()) {
      return this.playlist.nowPlaying().id;
    }
    return {};
  },
  nextSong: function (songId) {
    if (songId == this.playlist.nowPlaying().id) {
      this.playlist.nextSong();
      this.io.sockets.emit("nowPlaying", this.nowPlaying())
      if (this.playlist.currentSong +2 >= this.playlist.length) {
        var related = this.playlist.pickSongFromRelated();
        this.addSong(related);
      }
    }
  },
  prevSong: function(songId) {
    if (songId == this.playlist.nowPlaying().id) {
      this.playlist.prevSong();
      this.io.sockets.emit("nowPlaying", this.nowPlaying())
    }
  },
  playerState: function(state) {
    this.io.to("clients").emit("playerState", state);
  },
  requestState: function() {
    this.io.to("players").emit("requestState");
  },
  selectSong: function(index) {
    this.playlist.currentSong = index;
    this.io.emit("nowPlaying", this.nowPlaying());
  },
  pause: function () {
    this.io.emit("pause")
  },
  play: function () {
    this.io.emit("play")
  },
  mute: function() {
    this.io.to("players").emit("mute");
  },
  unMute: function() {
    this.io.to("players").emit("unMute");
  },
  changeVolume: function(vol) {
    this.io.to("players").emit("changeVolume", vol);
  },
  seek: function(time) {
    this.io.to("players").emit("seek", time);
  },
};

module.exports = api;