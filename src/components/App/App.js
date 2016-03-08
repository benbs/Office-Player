/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

// region imports
import React, { Component, PropTypes } from 'react';
import emptyFunction from 'fbjs/lib/emptyFunction';
import cx from 'classnames';

import s from './App.scss';

import PlayerStore from '../../stores/PlayerStore';
import Socket from '../../api/Socket';
import {getPlaylist, nowPlaying, getPlayerState, hasMaster} from '../../actions/PlayerActionCreators';

import Header from '../Header';
import NowPlaying from '../NowPlaying';
import Playlist from '../Playlist';
import PlayerInfo from '../PlayerInfo';
import Search from '../Search';
// endregion

function getStateFromStores() {
  return {
    playlist: PlayerStore.getPlaylist(true),
    nowPlaying: PlayerStore.nowPlaying(),
    isMaster: PlayerStore.isMaster(),
    hasMaster: PlayerStore.hasMaster(),
    playerState: PlayerStore.getPlayerState(),
    player: PlayerStore.isPlayer()
  }
}
class App extends Component {

  constructor(props) {
    super(props);
    this.state = getStateFromStores();
  }

  static propTypes = {
    context: PropTypes.shape({
      insertCss: PropTypes.func,
      onSetTitle: PropTypes.func,
      onSetMeta: PropTypes.func,
      onPageNotFound: PropTypes.func
    }),
    //children: PropTypes.element.isRequired,
    error: PropTypes.object
  };

  static childContextTypes = {
    insertCss: PropTypes.func.isRequired,
    onSetTitle: PropTypes.func.isRequired,
    onSetMeta: PropTypes.func.isRequired,
    onPageNotFound: PropTypes.func.isRequired
  };

  getChildContext() {
    const context = this.props.context;
    return {
      insertCss: context.insertCss || emptyFunction,
      onSetTitle: context.onSetTitle || emptyFunction,
      onSetMeta: context.onSetMeta || emptyFunction,
      onPageNotFound: context.onPageNotFound || emptyFunction
    };
  }

  onStoreChange() {
    this.setState(getStateFromStores());
  }

  componentWillMount() {
    this.removeCss = this.props.context.insertCss(s);
  }

  componentDidMount() {
    PlayerStore.addChangeListener(this.onStoreChange.bind(this));
    Socket.init();
    require('../../actions/SocketActionCreators');
    getPlaylist(true);
    nowPlaying();
    getPlayerState();
    hasMaster();
  }

  componentWillUnmount() {
    this.removeCss();
    PlayerStore.removeChangeListener(this.onStoreChange.bind(this));
  }

  render() {
    let nowPlaying = PlayerStore.getSong(this.state.nowPlaying);
    let bgImage = nowPlaying && nowPlaying.getIn(['thumbnails', 'high', 'url']);
    if (!bgImage) {
      bgImage = 'http://www.mycity-web.com/wp-content/uploads/2015/09/music.jpg';
    }
    return !this.props.error ? (
      <div>
        <div className={s.coverImage} style={{backgroundImage: `url(${bgImage})`}}></div>
        <div className={s.playerWrapper}>
          <Header />
          <NowPlaying song={this.state.nowPlaying}
                      isMaster={this.state.isMaster}
                      hasMaster={this.state.hasMaster}
                      player = {this.state.player}
                      playerState={this.state.playerState} />
          <div className={cx(s.mainContent, {[s.withPlayer]: this.state.player || this.state.isMaster})}>
            <Search isMaster={this.state.isMaster} isPlayer={this.state.player} />
            <Playlist playlist={this.state.playlist} />
            <PlayerInfo song={this.state.nowPlaying} />
          </div>
        </div>
      </div>
    ) : <noscript />;
  }

}

export default App;
