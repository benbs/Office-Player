/**
 * Created by Ben on 29/05/2015.
 */
var Dispatcher = require('../AppDispatcher');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var vars = require('../constants');
var _ = require('underscore');

var _playlist = {};
var _nowPlaying = "";
var _playerState = "play";

function _addSong(song) {
  _playlist[song.id] = song;
}

function _setPlaylist(playlist) {
  if (typeof playlist[0] === "object") {
    playlist.forEach(function (song) {
      _addSong(song);
    });
  }
  else {
    var newPlaylist = {};
    playlist.forEach(function(song) {
      newPlaylist[song] = _playlist[song];
    });
    _playlist = newPlaylist;
  }
}

var PlaylistStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(vars.EVENTS.Change);
  },
  addChangeListener: function (callback) {
    this.on(vars.EVENTS.Change, callback);
  },
  removeChangeListener: function () {
    this.removeListener(vars.EVENTS.Change);
  },

  getPlaylist: function() {
    return _playlist;
  },
  nowPlaying: function() {
    return _nowPlaying;
  },
  getPlayerState: function() {
    return _playerState;
  }
});

Dispatcher.register(function (action) {
  switch (action.actionType) {
    case vars.EVENTS.AddSong:
      _addSong(action.song);
      PlaylistStore.emitChange();
      break;
    case vars.EVENTS.SetPlaylist:
      _setPlaylist(action.playlist);
      PlaylistStore.emitChange();
      break;
    case vars.EVENTS.NowPlaying:
      _nowPlaying = action.nowPlaying;
      PlaylistStore.emitChange();
      break;
    case vars.EVENTS.PlayerState:
      _playerState = action.state;
      PlaylistStore.emitChange();
      break;
  }
});
module.exports = PlaylistStore;