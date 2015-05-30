var _und = require("underscore")
var Backbone = require('backbone')

var Song = require("./Song.js")

var Playlist = Backbone.Collection.extend({
  model: Song,
  currentSong: 0,
  nowPlaying: function () {
    return this.models[this.currentSong];
  },
  nextSong: function () {
    this.currentSong++;
  },
  prevSong: function () {
    this.currentSong--;
    if (this.currentSong == -1) {
      this.currentSong = this.length;
    }
  },
  selectSong: function(songId) {
    var that = this;
    var next = _und(this.models).find(function(song, idx) {
      if (song.id == songId) {
        that.currentSong = idx;
        return true;
      }
      return false;
    });
    return next? true : false;
  },
  pickSongFromRelated: function() {
    var playlistIdList = this.models.map(function(song){return song.id})
    var globalRelatedlist = []
    _und(this.models).last(5).forEach((function(song) {
      var relatedList = _und(song.get("relatedSongs")).map(function(related) {return related.id.videoId})
      globalRelatedlist = _und.union(globalRelatedlist, relatedList)
    }).bind(this))
    globalRelatedlist = _und(globalRelatedlist).without(playlistIdList)
    return _und.sample(globalRelatedlist)
  }
});

module.exports = Playlist;