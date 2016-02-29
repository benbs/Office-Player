/**
 * Created by Ben on 2/22/2016.
 */
import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';

import s from './PlaylistItem.scss'

import PlayerStore from '../../stores/PlayerStore';
import {selectSong, changeSong} from '../../actions/PlayerActionCreators';

class PlaylistItem extends Component {
  constructor(props) {
    super(props);
  }

  getDragHeight() {
    return 30;
  }

  handleClick() {
    selectSong(this.props.item.id);
  }

  handleDoubleClick() {
    changeSong(this.props.item.id);
  }

  render() {
    const {item, itemSelected, dragHandle} = this.props;
    const dragged = itemSelected !== 0;
    const selected = item.id === PlayerStore.getSelectedSongId();
    const isPlaying = item.id === PlayerStore.nowPlaying();

    return (
      <div className={cx(s.root, {dragged, [s.selected]: selected, [s.nowPlaying]: isPlaying})}
           onClick={this.handleClick.bind(this)} onDoubleClick={this.handleDoubleClick.bind(this)}>
        {dragHandle(<div className={s.dragHandle}><i className="fa fa-ellipsis-v" /><i className="fa fa-ellipsis-v" /></div>)}
        { item.title }
      </div>
    );
  }
}

export default withStyles(PlaylistItem, s);
