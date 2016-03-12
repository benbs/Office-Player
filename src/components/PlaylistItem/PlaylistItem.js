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

    // Don't replace items with themselves
    if (dragIndex === hoverIndex)  {
      return;
    }
    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Determine mouse position
    const clientOffset = monitor.getClientOffset();
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%
    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
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

  parseDuration(duration) {
    let durationParts = duration.match(/(\d+)(?=[MHS])/ig) || [];

    return durationParts.map(function (item) {
      if (item.length < 2) {
        return '0' + item;
      }
      return item;
    }).join(':');
  }

  render() {
    const {item, isDragging, connectDragSource, connectDropTarget} = this.props;
    const selected = item.get('id') === PlayerStore.getSelectedSongId();
    const isPlaying = item.get('id') === PlayerStore.nowPlaying();
    let duration = this.parseDuration(item.get('duration'));

    return connectDragSource(connectDropTarget(
      <div className={cx(s.root, {dragged: isDragging, [s.selected]: selected, [s.nowPlaying]: isPlaying})}
           onClick={this.handleClick.bind(this)} onDoubleClick={this.handleDoubleClick.bind(this)}>
        <i className={cx("fa fa-play", s.songButton)} onClick={() => changeSong(item.get('id'))} />
        <i className={cx("fa fa-trash", s.songButton)} onClick={() => deleteSong(item.get('id'))} />
        <span className={s.songTitle}>{ item.get('title') }</span>
        <span className={s.songDuration}>{duration}</span>
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
