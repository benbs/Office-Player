/**
 * Created by Ben on 29/05/2015.
 */
var React = require('react');
var PlaylistActions = require('../actions/PlaylistActions');
var PlaylistStore = require('../stores/PlaylistStore');
var PlayerStore = require('../stores/PlayerStore');
var VolumeController = require('./VolumeController');
var SongTime = require('./SongTime');

var NowPlaying = React.createClass({
  loadState: function() {
    var nowPlaying = PlaylistStore.getPlaylist()[PlaylistStore.nowPlaying()];
    var playerState = PlayerStore.getPlayerState();
    return {
      nowPlaying: nowPlaying,
      playerState: PlaylistStore.getPlayerState(),
      volume: playerState.volume,
      isMuted: playerState.isMuted,
      time: playerState.time
    }
  },
  getInitialState: function() {
    return this.loadState();
  },
  componentDidMount: function() {
    PlaylistStore.addChangeListener(this._onChange);
    PlayerStore.addChangeListener((this._onChange));
  },
  componentWillUnmount: function() {
    PlaylistStore.removeChangeListener(this._onChange);
    PlayerStore.removeChangeListener(this._onChange);
  },
  _onChange: function() {
    this.setState(this.loadState());
  },

  nextSong: function() {
    PlaylistActions.nextSong(this.state.nowPlaying.id);
  },
  prevSong: function() {
    PlaylistActions.prevSong(this.state.nowPlaying.id);
  },
  mute: function(){
    //this.setState({isMuted: true});
    PlaylistActions.mute();
  },
  unMute: function(){
    //this.setState({isMuted: false});
    PlaylistActions.unMute();
  },

  getDurationInSeconds: function(duration) {
    var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
    var hours = 0, minutes = 0, seconds = 0;

    if (reptms.test(duration)) {
      var matches = reptms.exec(duration);
      if (matches[1]) hours = Number(matches[1]);
      if (matches[2]) minutes = Number(matches[2]);
      if (matches[3]) seconds = Number(matches[3]);
      return hours * 3600  + minutes * 60 + seconds;
    }
  },

  render: function() {
    var song = this.state.nowPlaying;
    if (!song) {
      return (
        <div id="now-playing"><i class="fa fa-refresh fa-spin" /></div>
      );
    }
    //var time = (new Date(this.state.time));
    //var formatedTime = time.getMinutes()+":"+time.getSeconds();
    //if (time.getHours() > 0) {
    //  formatedTime = time.getHours()+":"+formatedTime;
    //}
    console.log(song);
    return (
      <div id="now-playing">
        <div className="song-thumbnail">
          <img src={song.snippet.thumbnails.default.url} />
        </div>
        <div id="song-info">
          <h3 dir="auto">{song.snippet.title}</h3>
          <div id="player-buttons">
            <button className="btn btn-danger" onClick={this.prevSong}>
              <i className="fa fa-step-backward" />
            </button>
            {(this.state.playerState == "pause")?
            <button className="btn btn-danger" onClick={PlaylistActions.play}>
              <i className="fa fa-play" />
            </button> :
            <button className="btn btn-danger" onClick={PlaylistActions.pause}>
              <i className="fa fa-pause" />
            </button>
            }
            <button className="btn btn-danger" onClick={this.nextSong}><i className="fa fa-step-forward" /></button>
            <VolumeController
              mute={this.state.isMuted}
              onMute={this.mute}
              onUnMute={this.unMute}
              volume={this.state.volume} />
            <SongTime duration={this.getDurationInSeconds(song.contentDetails.duration)}
              time={this.state.time}/>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = NowPlaying;