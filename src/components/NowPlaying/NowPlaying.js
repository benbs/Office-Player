/**
 * Created by Ben on 2/22/2016.
 */
import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import {throttle, debounce} from 'lodash';
import Player from 'react-player';

import s from './NowPlaying.scss';

import {play, pause, nextSong, prevSong, setMaster, reportPlayerState, changeVolume, seek, togglePlayer}
  from '../../actions/PlayerActionCreators';
import PlayerStore from '../../stores/PlayerStore';
import {SongTypes} from '../../models/Song';
import {auth} from '../../config';

class NowPlaying extends Component {
  constructor(props) {
    super(props);

    this.state = {
      volume: this.props.playerState.get('volume'),
      played: this.props.playerState.get('played')
    };
  }

  componentDidMount() {
    if (this.props.player) {
      this.refs.player.seekTo(this.props.playerState.get('played'));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.player || this.props.isMaster) {
      this.setState({
        volume: nextProps.playerState.get('volume'),
        played: nextProps.playerState.get('played')
      });
    }
  }

  componentDidUpdate() {
    let played = this.props.playerState.get('played');
    let deltaPlayed = Math.abs(played - this.state.played);
    if (deltaPlayed > 0.1) {
      this.refs.player.seekTo(played);
    }
  }

  handleEnd() {
    if (this.props.isMaster) {
      nextSong(this.props.song);
    }
  }

  handleProgress(e) {
    let deltaTime = Math.abs(this.state.played - e.played);
    this.setState({
      played: e.played
    });
    if (this.props.isMaster) {
      this.t_reportPlayerState();
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

  changeVolume(e) {
    let vol = e.target.value;
    this.setState({volume: vol});
    if (!this.props.player || this.props.isMaster) {
      this.d_changeVolume(vol)
    }
  }

  seek(e) {
    let played = e.target.value;
    this.setState({played});
    if (!this.props.player || this.props.isMaster) {
      this.d_seek(played);
    }
  }

  d_changeVolume = debounce((vol) => {
    changeVolume(vol);
  }, 500);

  d_seek = debounce((played) => {
    seek(played);
  }, 500);

  t_reportPlayerState = throttle(() => {
    reportPlayerState(this.state.played);
  }, 3000);

  render() {
    let playerState = this.props.playerState;
    let song = PlayerStore.getSong(PlayerStore.nowPlaying());
    let displayMasterBtn = !this.props.hasMaster || this.props.isMaster;
    return (
      <div className={s.root}>
        <div className={s.content}>
            {(this.props.isMaster || this.props.player) ?
              <Player ref="player"
                      url={song.get('url')}
                      playing={playerState.get('playing')}
                      volume={this.state.volume}
                      soundcloudConfig={{clientId: auth.soundcloud.key}}
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
            <span className={s.playerButton} onClick={this.handlePrevSong.bind(this)}>
              <i className="fa fa-step-backward" />
            </span>
            {(!playerState.get('playing')) ?
              <span className={s.playerButton} onClick={play}>
                <i className="fa fa-play" />
              </span> :
              <span className={s.playerButton} onClick={pause}>
                <i className="fa fa-pause" />
              </span>
            }
            <span className={s.playerButton} onClick={this.handleNextSong.bind(this)}>
              <i className="fa fa-step-forward" />
            </span>
            <span className={cx(s.playerButton, s.volumeButton)}>
              <i className="fa fa-volume-up" />
              <div className={s.volumeSlider}>
                <input type='range' min={0} max={1}
                       value={this.state.volume} step='any'
                       onChange={this.changeVolume.bind(this)} />
              </div>
            </span>
            {(!this.props.isMaster) ?
              <span className={s.playerButton} onClick={togglePlayer}>
                <i className="fa fa-television" />
              </span>: ''}

            {(displayMasterBtn) ?
              <span className={cx(s.playerButton, {[s.masterButtonEnabled]: this.props.isMaster})}
                    onClick={setMaster}>
              <i className="fa fa-microphone" />
            </span> : ''}
            <div className={s.progressBar}>
              <input type='range' min={0} max={1} onChange={this.seek.bind(this)}
                     value={this.state.played} step='any'
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(NowPlaying, s);
