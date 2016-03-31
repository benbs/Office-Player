/**
 * Created by Ben on 2/22/2016.
 */
import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';

import s from './PlaylistItem.scss'

import PlayerStore from '../../stores/PlayerStore';
import {selectSong, changeSong, deleteSong} from '../../actions/PlayerActionCreators';
import { findDOMNode } from 'react-dom';
import { DragSource, DropTarget } from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    if (dragIndex === hoverIndex)  {
      return;
    }
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }
    props.moveCard(dragIndex, hoverIndex);
    monitor.getItem().index = hoverIndex;
  }
};

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
    const {item, isDragging, connectDragSource, connectDropTarget} = this.props;
    const selected = item.get('id') === PlayerStore.getSelectedSongId();
    const isPlaying = item.get('id') === PlayerStore.nowPlaying();

    return connectDragSource(connectDropTarget(
      <div className={cx(s.root, {dragged: isDragging, [s.selected]: selected, [s.nowPlaying]: isPlaying})}
           onClick={this.handleClick.bind(this)} onDoubleClick={this.handleDoubleClick.bind(this)}>
        <i className={cx("fa fa-play", s.songButton)} onClick={() => changeSong(item.get('id'))} />
        <i className={cx("fa fa-trash", s.songButton)} onClick={() => deleteSong(item.get('id'))} />
        <span className={s.songTitle}>{ item.get('title') }</span>
        <span className={s.songDuration}>{item.get('duration')}</span>
      </div>
    ));
  }
}


export default withStyles(
  DropTarget('card', cardTarget, connect => ({
    connectDropTarget: connect.dropTarget()
  }))(DragSource('card', cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  }))(PlaylistItem))
  , s);
