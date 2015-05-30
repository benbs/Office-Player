/**
 * Created by Ben on 29/05/2015.
 */
var io = require('socket.io-client');
//var PlaylistActions = require('./actions/PlaylistActions');

var socket = null;

var SocketActions = {
  //listen: function() {
  //  debugger;
  //  socket.on("getPlaylist", function(playlist) {
  //    PlaylistActions.setPlaylist(playlist);
  //  });
  //  socket.on("loadSong", function(song) {
  //    PlaylistActions.loadSong(song);
  //  });
  //},
  init: function() {
    socket = io();
    socket.emit("registerAsClient");
  },
  on: function(event, callback) {
    socket.on(event, callback);
  },
  addSong: function(yId) {
    socket.emit("addSong", yId);
  },
  addPlaylist: function(pId) {
    socket.emit("addPlaylist", pId);
  },
  getPlaylist: function(data){
    socket.emit("getPlaylist", data);
  },
  nowPlaying: function() {
    socket.emit("nowPlaying");
  },
  changeSong: function(songId) {
    socket.emit("selectSong", songId);
  },
  clearPlaylist: function() {
    socket.emit("clearPlaylist");
  },
  deleteSong: function(songId) {
    socket.emit("deleteSong", songId);
  },
  nextSong: function(currSong) {
    socket.emit("nextSong", currSong);
  },
  prevSong: function(currSong) {
    socket.emit("prevSong", currSong);
  },
  play: function() {
    socket.emit("play");
  },
  pause: function() {
    socket.emit("pause");
  },
  mute: function() {
    socket.emit("mute");
  },
  unMute: function() {
    socket.emit("unMute");
  },
  changeVolume: function(vol) {
    socket.emit("changeVolume", vol);
  },
  requestPlayerState: function() {
    socket.emit("requestState");
  },
  seek: function(time) {
    socket.emit("seek", time);
  }
};

module.exports = SocketActions;