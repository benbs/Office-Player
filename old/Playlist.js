var _und = require("underscore");
var Backbone = require('backbone');

var Song = require("./Song.js");

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
  getDurationInSeconds: function(duration) {
    var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    var hours = 0, minutes = 0, seconds = 0;

    if (reptms.test(duration)) {
      var matches = reptms.exec(duration);
      if (matches[1]) hours = Number(matches[1]);
      if (matches[2]) minutes = Number(matches[2]);
      if (matches[3]) seconds = Number(matches[3]);
      return hours * 3600  + minutes * 60 + seconds;
    }
  },
  pickSongFromRelated: function() {
    var blacklist = ["live", "cover", "interview", "full album", "best of", "greatest hits"];
    var globalRelatedList = _und.chain(this.models).map(function(song){return song.get("relatedSongs")})
      .flatten().difference(this.models).reject(function(song){
        var blacklisted = _und.some(blacklist, function(term) {
          return (song.snippet.title).toLowerCase().indexOf(term) > -1;
        });
        return blacklisted;
      }).value();
    return _und.sample(_und.last(globalRelatedList, 10)).id.videoId;
  }
});

module.exports = Playlist;