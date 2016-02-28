/**
 * Created by Ben on 2/21/2016.
 */
import {fromJS, List} from 'immutable';
import _ from 'lodash';
import LRU from 'lru';

import BaseStore from './BaseStore';
import Dispatcher from '../core/Dispatcher';
import ActionTypes from '../constants/ActionTypes';

import {getPlaylist} from '../actions/PlayerActionCreators';

const songData = new LRU(100);

let playerState = fromJS({
  playing: false,
  volume: 0.8,
  duration: 0
});
let playlist = new List();
let nowPlaying = null;
let selectedSong = null;
let isMaster = false;

let debouncedGetPlaylist = _.debounce(getPlaylist, 1000);

function saveSongToCache(id, song) {
  songData.set(id, song.toJS());
}

function getSongFromCache(id) {
  let song = songData.get(id);
  if (song) {
    return fromJS(songData.get(id));
  }
  else {
    debouncedGetPlaylist(true);
  }
}

function loadSong(data) {
  let newSong = fromJS(data);
  saveSongToCache(newSong.get('id'), newSong);
  playlist = playlist.push(newSong.get('id'));
}

function loadPlaylist(data) {
  let newPlaylist = fromJS(data);
  if (typeof newPlaylist.get(0) === 'string') {
    playlist = newPlaylist;
  }
  else {
    playlist = new List();
    newPlaylist.forEach((song) => {
      playlist = playlist.push(song.get('id'));
      saveSongToCache(song.get('id'), song);
    });
  }
}

class PlayerStore extends BaseStore {
  constructor() {
    super("PlayerStore");
  }

  getPlaylist(data) {
    if (!data) {
      return playlist;
    }
    else {
      return playlist.map(songId => getSongFromCache(songId));
    }
  }

  getSong(songId) {
    return getSongFromCache(songId);
  }

  nowPlaying() {
    return nowPlaying;
  }

  getSelectedSongId() {
    return selectedSong;
  }

  isMaster() {
    return isMaster;
  }

  getPlayerState() {
    return playerState;
  }
}

let storeInstance = new PlayerStore();

storeInstance.dispatchToken = Dispatcher.register(action => {
  switch(action.type) {
    case ActionTypes.LOAD_SONG:
      loadSong(action.song);
      storeInstance.emitChange();
      break;
    case ActionTypes.LOAD_PLAYLIST:
      loadPlaylist(action.playlist);
      storeInstance.emitChange();
      break;
    case ActionTypes.NOW_PLAYING:
      nowPlaying = action.songId;
      storeInstance.emitChange();
      break;
    case ActionTypes.SELECT_SONG:
      selectedSong = action.songId;
      storeInstance.emitChange();
      break;
    case ActionTypes.SET_MASTER:
      isMaster = true;
      storeInstance.emitChange();
      break;
    case ActionTypes.PLAYER_STATE:
      playerState = fromJS(action.state);
      storeInstance.emitChange();
      break;
    case ActionTypes.PLAY:
    case ActionTypes.PAUSE:
      break;
  }
});

export default storeInstance;
