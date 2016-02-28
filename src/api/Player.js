/**
 * Created by Ben on 2/20/2016.
 */

import {List, Map, fromJS} from 'immutable';
import LRU from 'lru';

let songData = new LRU(1000);

class Player {
  songList = new List();
  currentSongIdx = 0;
  playerState = fromJS({
    playing: false,
    played: 0.0,
    volume: 0.8
  });

  getSongData(songId) {
    return fromJS(songData.get(songId));
  }

  addSongToCache(song) {
    songData.set(song.get('id'), song.toJS());
  }

  nowPlaying() {
    return this.songList.get(this.currentSongIdx);
  }

  nextSong() {
    this.currentSongIdx++;
  }

  prevSong() {
    this.currentSongIdx--;
    if (this.currentSongIdx == -1) {
      this.currentSongIdx = this.length;
    }
  }

  selectSong(songId) {
    let next = this.songList.findIndex(song => song === songId);
    if (next) {
      this.currentSongIdx = next;
      return true;
    }
    return false;
  }

  filterRelatedSongs(relatedSongList) {
    console.log(relatedSongList);
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
