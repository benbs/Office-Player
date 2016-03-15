/**
 * Created by Ben on 2/20/2016.
 */

import {List, Map, fromJS} from 'immutable';
import LRU from 'lru';
import Song from '../models/Song';

let songData = new LRU(1000);

class Player {
  songList = new List();
  currentSong = null;
  playerState = fromJS({
    playing: false,
    played: 0.0,
    volume: 0.8
  });

  getSongData(songId) {
    let data = songData.get(songId);
    return data ? new Song(fromJS(data)) : undefined;
  }

  addSongToCache(song) {
    songData.set(song.get('id'), song.toJS());
  }

  nowPlaying() {
    return this.currentSong;
  }

  getCurrentSongIndex() {
    return this.songList.findIndex(songId => songId === this.currentSong);
  }

  nextSong() {
    let nextSongIndex = this.getCurrentSongIndex() + 1;
    if (nextSongIndex != this.songList.count()) {
      this.currentSong = this.songList.get(nextSongIndex);
    }
  }

  prevSong() {
    let prevSongIndex = this.getCurrentSongIndex() - 1;
    if (prevSongIndex != -1) {
      this.currentSong = this.songList.get(prevSongIndex);
    }
  }

  selectSong(songId) {
    let nexSongIndex = this.songList.findIndex(song => song === songId);
    if (nexSongIndex !== null) {
      this.currentSong = this.songList.get(nexSongIndex);
      return true;
    }
    return false;
  }

  filterRelatedSongs(relatedSongList) {
    let blacklist = fromJS(["live", "cover", "interview", "full album", "best of", "greatest hits"]);
    return relatedSongList.filter(song => {
      return !blacklist.some(term => song.getIn(['snippet', 'title']).toLowerCase().indexOf(term) > -1)
    });
  }

  pickSongFromRelated() {
    let lastSongs = this.songList.takeLast(3);
    let getSongData = this.getSongData;
    let globalRelatedList = new List();
    lastSongs.forEach(song => {
      globalRelatedList = globalRelatedList.push(...getSongData(song).get('relatedSongs'))
    });
    globalRelatedList = this.filterRelatedSongs(globalRelatedList);
    var randomSongIdx = Math.floor((Math.random() * globalRelatedList.count()));
    return globalRelatedList.getIn([randomSongIdx, 'id', 'videoId']);
  }

  hasSong(songId) {
    return this.songList.some(song => song === songId);
  }
}

const instance = new Player();
export default instance;
