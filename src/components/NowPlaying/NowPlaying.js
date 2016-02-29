/**
 * Created by Ben on 2/22/2016.
 */
import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import Player from 'react-player';

import s from './NowPlaying.scss';

import {play, pause, nextSong, prevSong, setMaster, reportPlayerState} from '../../actions/PlayerActionCreators';
import PlayerStore from '../../stores/PlayerStore';

class NowPlaying extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
      played: 0.0
    };
  }

  componentDidMount() {
    this.refs.player.seekTo(this.props.playerState.get('played'));
  }

  componentDidUpdate() {
    let played = this.props.playerState.get('played');
    let deltaPlayed = Math.abs(played - this.state.played);
    if (deltaPlayed > 0.03) {
      //this.refs.player.seekTo(played);
    }
  }

  handleEnd() {
    if (this.props.isMaster) {
      nextSong(this.props.song);
    }
  }

  handleProgress(e) {
    this.setState({
      played: e.played
    });
    if (this.props.isMaster) {
      reportPlayerState(e.played);
    }
  }

  handleNextSong() {
    nextSong(this.props.song);
    //this.refs.player.seekTo(this.props.playerState.get('played'));
  }

  handlePrevSong() {
    prevSong(this.props.song);
    //this.refs.player.seekTo(this.props.playerState.get('played'));
  }

  togglePlayer() {
    this.setState({visible: !this.state.visible});
  }

  render() {

    let playerState = this.props.playerState;
    let song = PlayerStore.getSong(PlayerStore.nowPlaying());

    return (
      <div className={s.root}>
        <div className={s.content}>
          {(!this.props.isMaster) ?
            <div>
              <button onClick={this.togglePlayer.bind(this)}>Toggle Player</button>
              <button onClick={setMaster}>Set as Master</button>
            </div>: 'You are a master!'
          }
            {(this.props.isMaster || this.state.visible) ?
              <Player ref="player"
                      url={`https://www.youtube.com/watch?v=${this.props.song}`}
                      playing={playerState.get('playing')}
                      volume={this.props.isMaster ? playerState.get('volume') : 0}
                      onEnded={this.handleEnd.bind(this)}
                      onProgress={this.handleProgress.bind(this)}
                  className={s.player} /> : ''
            }
          <div className={s.songInfo}>
            {(song) ?
              <div className={s.songInfoWrapper}>
                <img src={song.getIn(['thumbnails', 'default', 'url'])} />
                <h2>{song.get('title')}</h2>
              </div>
              : '' }
          </div>
          <div className={s.playerButtons}>
            <span className={s.playerButton} onClick={this.handlePrevSong.bind(this)}><i className="fa fa-step-backward" /></span>
            {(!playerState.get('playing')) ?
              <span className={s.playerButton} onClick={play}><i className="fa fa-play" /></span> :
              <span className={s.playerButton} onClick={pause}><i className="fa fa-pause" /></span>
            }
            <span className={s.playerButton} onClick={this.handleNextSong.bind(this)}><i className="fa fa-step-forward" /></span>
            <input
              type='range' min={0} max={1} step='any'
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(NowPlaying, s);
