/**
 * Created by Ben on 2/22/2016.
 */
import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';

import s from './PlaylistItem.scss'

import PlayerStore from '../../stores/PlayerStore';
import {selectSong, changeSong, deleteSong} from '../../actions/PlayerActionCreators';

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

  renderDragHandle() {
    let dragContent = (
      <div className={s.dragHandle}>
        <i className="fa fa-ellipsis-v" />
        <i className="fa fa-ellipsis-v" />
      </div>
    );
    return this.props.dragHandle(dragContent);
  }

  render() {
    const {item, itemSelected} = this.props;
    const dragged = itemSelected !== 0;
    const selected = item.id === PlayerStore.getSelectedSongId();
    const isPlaying = item.id === PlayerStore.nowPlaying();

    let duration = item.duration
      .replace("PT", "").replace("S", "").replace("H", ":").replace("M", ":").split(":");
    duration.forEach(function(pt, i) { duration[i] = (pt.length == 1)? "0"+pt : pt });
    duration = duration.join(":");

    return (
      <div className={cx(s.root, {dragged, [s.selected]: selected, [s.nowPlaying]: isPlaying})}
           onClick={this.handleClick.bind(this)} onDoubleClick={this.handleDoubleClick.bind(this)}>
        {this.renderDragHandle()}
        <i className={cx("fa fa-play", s.songButton)} onClick={() => changeSong(item.id)} />
        <i className={cx("fa fa-trash", s.songButton)} onClick={() => deleteSong(item.id)} />
        <span className={s.songTitle}>{ item.title }</span>
        <span className={s.songDuration}>{duration}</span>
      </div>
    );
  }
}

export default withStyles(PlaylistItem, s);
