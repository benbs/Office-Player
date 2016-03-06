/**
 * Created by Ben on 2/21/2016.
 */
import Dispatcher from '../core/Dispatcher';
import Socket from '../api/Socket';
import ActionTypes from '../constants/ActionTypes';

export function selectSong(songId) {
  Dispatcher.dispatch({
    type: ActionTypes.SELECT_SONG,
    songId
  })
}

export function addSong(yId) {
  Socket.emit("addSong", yId);
}

export function addPlaylist(pId) {
  Socket.emit("addPlaylist", pId);
}

export function getPlaylist(data){
  Socket.emit("getPlaylist", data);
}

export function nowPlaying() {
  Socket.emit("nowPlaying");
}

export function changeSong(songId) {
  Socket.emit("selectSong", songId);
}

export function clearPlaylist() {
  Socket.emit("clearPlaylist");
}

export function deleteSong(songId) {
  Socket.emit("deleteSong", songId);
}

export function nextSong(currSong) {
  Socket.emit("nextSong", currSong);
}

export function prevSong(currSong) {
  Socket.emit("prevSong", currSong);
}

export function play() {
  Socket.emit("play");
}

export function pause() {
  Socket.emit("pause");
}

export function mute() {
  Socket.emit("mute");
}

export function unMute() {
  Socket.emit("unMute");
}

export function changeVolume(vol) {
  Socket.emit("changeVolume", vol);
}

export function getPlayerState() {
  Socket.emit("playerState");
}

export function seek(time) {
  Socket.emit("seek", time);
}

export function reorderList(newList) {
  Socket.reorderList(newList);
}

export function setMaster() {
  Socket.emit('setMaster');
}

export function hasMaster() {
  Socket.emit('hasMaster');
}

export function reportPlayerState(played) {
  Socket.emit('playerState', played);
}

export function togglePlayer() {
  Dispatcher.dispatch({
    type: ActionTypes.TOGGLE_PLAYER
  })
}
