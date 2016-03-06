/**
 * Created by Ben on 2/20/2016.
 */

import {List, Map, fromJS} from 'immutable';

import Player from './Player';
import {getSong, getPlaylist, getRelatedSongs} from './YoutubeAPI';

function songSchema(song) {
  if (!song) {
    return new Map();
  }
  return new Map()
    .set('id', song.get('id'))
    .set('title', song.getIn(['snippet', 'title']))
    .set('thumbnails', song.getIn(['snippet', 'thumbnails']))
    .set('duration', song.getIn(['contentDetails', 'duration']));
}

function _getPlaylist(data) {
  if (data) {
    //return Player.songList.toJS();
    return Player.songList.map(songId => songSchema(Player.getSongData(songId))).toJS();
  }
  else {
    return Player.songList.toJS();
  }
}

async function loadSong(songId, currentSongId) {
  if (!songId || songId.length != 11) {
    throw new Error(`Invalid song id '${songId}'`);
  }
  if (Player.hasSong(songId)) {
    throw new Error('Song already exists');
  }
  if (!Player.getSongData(songId)) {
    let songData = await getSong(songId);
    songData = songData.set('relatedSongs', new List());
    try {
      songData = songData.set('relatedSongs', await getRelatedSongs(songId));
    }
    catch (err) {
      console.log(`couldnt get related songs - ${err}`);
    }

    Player.addSongToCache(songData);
  }

  if (!currentSongId || currentSongId === Player.currentSong) {
    Player.songList = Player.songList.push(songId);
    return Player.getSongData(songId);
  }
}

class PlayerAPI {

  io = null;
  player = null;
  masterSocketId = null;
  lastSeekTime = 0;

  constructor(io) {
    this.io = io;
    this.player = Player;
  }

  async getPlaylist(data) {
    return _getPlaylist(data);
  }

  async getSong(songId) {
    return songSchema(this.player.getSongData(songId)).toJS();
  }

  //async getSongs(songs) {
  //  console.log(songs);
  //  let immSongs = fromJS(songs);
  //  return this.player.songList.filter(song => {
  //    return songSchema(immSongs.some(requestedSongId => requestedSongId === song.get('id')));
  //  }).toJS();
  //}

  async nowPlaying() {
    return this.player.nowPlaying();
  }

  async addSong(songId, currentSongId) {
    let songData = await loadSong(songId, currentSongId);
    if (this.player.songList.count() === 1) {
      this.player.playerState = this.player.playerState.set('playing', true);
      this.player.currentSong = songId;
      this.io.emit('nowPlaying', this.player.nowPlaying());
      this.io.emit('playerState', this.player.playerState.toJS());
    }
    //this.io.to('clients').emit('loadSong', songData);
    this.io.emit('addSong', songSchema(songData));
    this.io.emit('getPlaylist', _getPlaylist());
  }

  async addPlaylist(playlistId) {
    let songs = await getPlaylist(playlistId);
    let promises = songs.map(song => loadSong(song.getIn(['snippet', 'resourceId', 'videoId'])));
    await Promise.all(promises);
    this.io.emit('getPlaylist', _getPlaylist());
  }

  async deleteSong(songId) {
    let songIndex = this.player.songList.findIndex(song => song === songId);
    this.player.songList = this.player.songList.delete(songIndex);
    this.io.emit("getPlaylist", _getPlaylist());
  }

  async clearPlaylist() {
    this.player.songList = new List();
    this.io.emit("getPlaylist", _getPlaylist());
    this.io.emit("nowPlaying", "");
  }

  async nextSong(currentSongId) {
    if (currentSongId === this.player.nowPlaying()) {
      await this.seek(0);
      this.player.nextSong();
      this.io.emit("nowPlaying", this.player.nowPlaying());
      if (this.player.getCurrentSongIndex() +2 >= this.player.songList.count()) {
        let related = this.player.pickSongFromRelated();
        this.addSong(related);
      }
    }
  }

  async prevSong(currentSongId) {
    if (currentSongId == this.player.nowPlaying()) {
      await this.seek(0);
      this.player.prevSong();
      this.io.sockets.emit("nowPlaying", this.player.nowPlaying())
    }
  }

  async playerState(played) {
    const now = (new Date()).getTime();
    if (now - this.lastSeekTime > 3000) {
      if (played) {
        this.player.playerState = this.player.playerState.set('played', played);
      }
      this.io.emit("playerState", this.player.playerState.toJS());
      const isLastSong = this.player.getCurrentSongIndex() + 1 == this.player.songList.count();
      if (this.player.songList.count() && isLastSong) {
        let related = this.player.pickSongFromRelated();
        this.addSong(related, this.player.currentSong);
      }
    }
  }

  async requestState() {
    this.io.emit("requestState");
  }

  async selectSong(songId) {
    await this.seek(0);
    this.player.selectSong(songId);
    this.io.emit("nowPlaying", this.player.nowPlaying());
    this.player.playerState = this.player.playerState.set('playing', true);
  }

  async pause () {
    this.player.playerState = this.player.playerState.set('playing', false);
    this.io.emit('playerState', this.player.playerState.toJS());
  }

  async play () {
    this.player.playerState = this.player.playerState.set('playing', true);
    this.io.emit('playerState', this.player.playerState.toJS());
  }

  async mute() {
    this.io.emit("mute");
  }

  async unMute() {
    this.io.emit("unMute");
  }

  async changeVolume(vol) {
    this.player.playerState = this.player.playerState.set('volume', vol);
    this.io.emit("changeVolume", vol);
  }

  async seek(time) {
    this.lastSeekTime = (new Date()).getTime();
    this.player.playerState = this.player.playerState.set('played', time);
    this.io.emit('playerState', this.player.playerState.toJS());
  }

  async reorderList(newList) {
    if (this.player.songList.count() === newList.length) {
      this.player.songList = fromJS(newList);
    }
    this.io.emit('getPlaylist', _getPlaylist());
  }

  async hasMaster() {
    return Boolean(this.masterSocketId);
  }
}

export default PlayerAPI;
