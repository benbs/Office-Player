var Dispatcher = require('../AppDispatcher');
var vars = require('../constants');
var Socket = require('../Socket');
var _ = require('underscore');

var PlaylistActions = {

  /**
   * add Song to servers's list
   * @param songId
   */
  addSong: function(songId) {
    Socket.addSong(songId);
  },
  addPlaylist: function(pId) {
    Socket.addPlaylist(pId);
  },
  getPlaylist: function(data) {
    Socket.getPlaylist(data);
  },
  getNowPlaying: function() {
    Socket.nowPlaying();
  },
  changeSong: function(songId) {
    Socket.changeSong(songId);
  },
  clearPlaylist: function() {
    Socket.clearPlaylist();
  },
  deleteSong: function(songId) {
    Socket.deleteSong(songId);
  },
  nextSong: function(currsong) {
    Socket.nextSong(currsong);
  },
  prevSong: function(currSong) {
    Socket.prevSong(currSong);
  },
  play: function() {
    Socket.play();
  },
  pause: function() {
    Socket.pause();
  },
  mute: function() {
    Socket.mute();
  },
  unMute: function() {
    Socket.unMute();
  },
  changeVolume: function(vol) {
    Socket.changeVolume(vol);
  },
  getPlayerState: function() {
    Socket.requestPlayerState();
  },
  seek: function(time) {
    Socket.seek(time);
  },

  /**
   * add song to playlist
   * @param song object
   */
  loadSong: function(song) {
    Dispatcher.dispatch({
      actionType: vars.EVENTS.AddSong,
      song: song
    })
  },

  /**
   * add playlist to collection
   * @param playlist
   */
  setPlaylist: function(playlist) {
    Dispatcher.dispatch({
      actionType: vars.EVENTS.SetPlaylist,
      playlist: playlist
    });
  },

  setNowPlaying: function(songId) {
    Dispatcher.dispatch({
      actionType: vars.EVENTS.NowPlaying,
      nowPlaying: songId
    });
  },

  setPlayerState: function(state) {
    Dispatcher.dispatch({
      actionType: vars.EVENTS.PlayerState,
      state: state
    });
  }
};

Socket.on("loadSong", function(song) {
  PlaylistActions.loadSong(song);
});
Socket.on("getSong", function(song) {
  PlaylistActions.loadSong(song);
});
Socket.on("getPlaylist", function(data) {
  PlaylistActions.setPlaylist(data);
});
Socket.on("nowPlaying", function(songId) {
  PlaylistActions.setNowPlaying(songId);
});
Socket.on("play", function() {
  PlaylistActions.setPlayerState("play");
});
Socket.on("pause", function() {
  PlaylistActions.setPlayerState("pause");
});
Socket.on("playerState", function(state) {
  Dispatcher.dispatch({
    actionType: vars.EVENTS.PlayerState,
    state: state
  });
});

module.exports = PlaylistActions;