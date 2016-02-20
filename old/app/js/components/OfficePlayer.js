/**
 * Created by Ben on 29/05/2015.
 */
var React = require('react');
var PlaylistStore = require('../stores/PlaylistStore');
var PlaylistActions = require('../actions/PlaylistActions');
var _ = require('underscore');
var Socket = require('../Socket');

require('../../style/OfficePlayer.less');
require('../../style/bootstrap.min.less');

var Search = require('./Search');
var Playlist = require('./Playlist');
var NowPlaying = require('./NowPlaying');

var OfficePlayer = React.createClass({
    loadState: function() {
      var nowPlaying = PlaylistStore.getPlaylist()[PlaylistStore.nowPlaying()];
      return {
        nowPlaying: nowPlaying
      }
    },
    getInitialState: function () {
      return this.loadState();
    },
    componentDidMount: function () {
      PlaylistStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
      PlaylistStore.removeChangeListener(this._onChange);
    },

    _onChange: function() {
      this.setState(this.loadState());
    },
    _addSong: function(data) {
      if (data.type == "youtube#playlist") {
        var pId = data.id.playlistId;
        PlaylistActions.addPlaylist(pId);
      }
      else {
        var videoId = data.id.videoId;
        PlaylistActions.addSong(videoId);
      }
    },
    _clearPlaylist: function() {
      PlaylistActions.clearPlaylist();
    },

    render: function () {
      var song = this.state.nowPlaying;
      var bgStyle = (song)? {backgroundImage: "url('"+song.snippet.thumbnails.high.url+"')"} :
        {backgroundColor: "#000"};
      return (
        <div id="main">
          <header style={bgStyle}></header>
          <section id="main-section">
            <NowPlaying />
            <div className="row">
              <div className="col-xs-1">
                <button className="btn btn-danger" onClick={this._clearPlaylist}><i className="fa fa-trash-o" /></button>
              </div>
              <div id="search" className="col-xs-11">
                <Search addSong={this._addSong} />
              </div>
            </div>
            <div id="playlist">
              <Playlist />
            </div>

          </section>
        </div>
      );
    }
  })
  ;

module.exports = OfficePlayer;