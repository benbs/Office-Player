var React = require('react');
var _ = require('underscore');
var Song = require('./Song');
var PlaylistStore = require('../stores/PlaylistStore');
var PlaylistActions = require('../actions/PlaylistActions');

var Playlist = React.createClass({
  loadState: function() {
    return {
      playlist: PlaylistStore.getPlaylist(),
      nowPlaying: PlaylistStore.nowPlaying()
    }
  },
  getInitialState: function() {
    return this.loadState();
  },
  componentDidMount: function () {
    PlaylistStore.addChangeListener(this._onChange);
    PlaylistActions.getPlaylist(true);
    PlaylistActions.getNowPlaying();
    PlaylistActions.getPlayerState();
  },
  componentWillUnmount: function() {
    PlaylistStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(this.loadState());
  },
  clearPlaylist: function () {
    PlaylistActions.clearPlaylist();
  },
  selectSong: function(song) {
    this.setState({selectedSong: song});
  },
  changeSong: function(songId) {
    var index = 0;
    _(this.state.playlist).chain().keys().find(function(val, key) {
      if (val == songId) {
        index = key;
        return true;
      }
      return false;
    }).value();
    PlaylistActions.changeSong(index);
  },
  render: function () {
    var thelist = this.state.playlist;
    var list = (thelist) ? _(thelist).map((function (song, idx) {
      var isPlaying = (this.state.nowPlaying && this.state.nowPlaying == song.id);
      var isSelected = (this.state.selectedSong && this.state.selectedSong == song.id);
      return <Song data={song} isPlaying={isPlaying} isSelected={isSelected}
                   onClick={this.selectSong.bind(this, idx)} changeSong={this.changeSong.bind(this, idx)}/>;
    }).bind(this)) : "";

    return (
      <div>
        <button className="btn btn-danger btn-clear" onClick={this.clearPlaylist}>Clear playlist</button>
        {list}
      </div>
    );
  }
});
module.exports = Playlist;
