/**
 * Created by Ben on 2/22/2016.
 */
import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {List} from 'immutable';
import {debounce} from 'lodash';

import s from './Playlist.scss'

import PlayerStore from '../../stores/PlayerStore';

import DraggableList from 'react-draggable-list';

import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend'
import PlaylistItem from '../PlaylistItem';

import {reorderList} from '../../actions/PlayerActionCreators'

const d_reorderList = debounce(newList => {
  reorderList(newList);
}, 500);

class Playlist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playlist: new List()
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      playlist: newProps.playlist
    });
  }

  moveCard(dragIndex, hoverIndex) {
    const dragCard = this.state.playlist.get(dragIndex);
    let playlist = this.state.playlist
      .splice(dragIndex, 1)
      .splice(hoverIndex, 0, dragCard);
    this.setState({playlist});
    d_reorderList(playlist.toJS());
  }

  render() {
    return (
      <div className={s.root}>
        {this.state.playlist.map((item, index) => {
          return <PlaylistItem key={item.get('id')}
                               index={index}
                               id={item.get('id')}
                               item={item}
                               moveCard={this.moveCard.bind(this)}
          />;
        })}
      </div>
    );
  }
}

export default withStyles(DragDropContext(HTML5Backend)(Playlist), s);
