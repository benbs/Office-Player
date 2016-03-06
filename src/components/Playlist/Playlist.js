/**
 * Created by Ben on 2/22/2016.
 */
import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './Playlist.scss'

import PlayerStore from '../../stores/PlayerStore';

import DraggableList from 'react-draggable-list';
import PlaylistItem from '../PlaylistItem';

import {reorderList} from '../../actions/PlayerActionCreators'

class Playlist extends Component {
  constructor(props) {
    super(props);
  }

  getItemKey(item) {
    return item.id;
  }

  render() {
    return (
      <div className={s.root}>
        <DraggableList
          itemKey={this.getItemKey.bind(this)}
          template={PlaylistItem}
          list={this.props.playlist.toJS()}
          onMoveEnd={reorderList}
          padding={0}
        />
      </div>
    );
  }
}

export default withStyles(Playlist, s);
