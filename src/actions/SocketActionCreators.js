/**
 * Created by Ben on 2/25/2016.
 */
import Dispatcher from '../core/Dispatcher';
import ActionTypes from '../constants/ActionTypes';
import Socket from '../api/Socket';

Socket.on("disconnect", function() {
  window.location.reload();
});

Socket.on("addSong", function(song) {
  Dispatcher.dispatch({
    type: ActionTypes.LOAD_SONG,
    song
  })
});

Socket.on("getSong", function(song) {
  Dispatcher.dispatch({
    type: ActionTypes.LOAD_SONG,
    song
  })
});

Socket.on("getPlaylist", function(playlist) {
  Dispatcher.dispatch({
    type: ActionTypes.LOAD_PLAYLIST,
    playlist
  })
});

Socket.on("nowPlaying", function(songId) {
  Dispatcher.dispatch({
    type: ActionTypes.NOW_PLAYING,
    songId
  })
});

Socket.on("play", function() {
  Dispatcher.dispatch({
    type: ActionTypes.PLAY
  })
});

Socket.on("pause", function() {
  Dispatcher.dispatch({
    type: ActionTypes.PAUSE
  })
});

Socket.on("playerState", function(state) {
  Dispatcher.dispatch({
    type: ActionTypes.PLAYER_STATE,
    state
  });
});

Socket.on('setMaster', function() {
  Dispatcher.dispatch({
    type: ActionTypes.SET_MASTER
  })
});

Socket.on('hasMaster', function(hasMaster) {
  Dispatcher.dispatch({
    type: ActionTypes.SET_HAS_MASTER,
    hasMaster
  })
});

Socket.on('changeVolume', function(volume) {
  Dispatcher.dispatch({
    type: ActionTypes.CHANGE_VOLUME,
    volume
  })
});

Socket.on('seek', function(played) {
  Dispatcher.dispatch({
    type: ActionTypes.SEEK,
    played
  })
})
