/**
 * Created by Ben on 2/22/2016.
 */
import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import cx from 'classnames';
import _ from 'lodash';

import fetch from '../../core/fetch';
import {auth} from '../../config';
import {objectToQuerystring} from '../../core/Utils';

import s from './Search.scss';

import {addSong, clearPlaylist} from '../../actions/PlayerActionCreators';

import Autocomplete from 'react-autocomplete';

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      loading: false
    };
  }
  onSelect(value, item) {
    this.setState({results: []});
    this.refs.autocomplete.setState({value: ''});
    addSong(item.id.videoId);
  }
  onChange = _.debounce(async (e, value) => {
    this.setState({loading: true});
    let baseURL = "https://www.googleapis.com/youtube/v3/search";
    let requestArgs = {
      part: 'snippet',
      key: auth.youtube.key,
      type: 'video,playlist',
      maxResults: '10',
      q: value
    };
    let url = baseURL + '?' + objectToQuerystring(requestArgs);
    let response = await fetch(url);
    let searchResults = await response.json();
    this.setState({results: searchResults.items, loading: false});
  }, 500);
  renderItem(item, isHighlighted) {
    return (
      <div className={cx(s.item, {[s.highlightedItem]: isHighlighted})}
           key={item.id.videoId} id={item.id.videoId}>
        <img src={item.snippet.thumbnails.default.url} />
        <span className={s.songTitle}>{item.snippet.title}</span>
      </div>
    );
  }
  render() {
    let menuStyle = {
      borderRadius: '3px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '2px 0',
      fontSize: '90%',
      position: 'fixed',
      zIndex: 3,
      overflow: 'auto',
      maxHeight: '50%', // TODO: don't cheat, let it flow to the bottom
    };
    return (
      <div className={s.root}>
        <span className={s.clearPlaylist} onClick={clearPlaylist}><i className="fa fa-trash" /></span>
        <div className={s.searchWrapper}>
          <Autocomplete
            ref="autocomplete"
            items={this.state.results}
            getItemValue={(item) => item.snippet.title}
            onSelect={this.onSelect.bind(this)}
            onChange={this.onChange.bind(this)}
            menuStyle={menuStyle}
            renderItem={this.renderItem.bind(this)}
            inputProps={{className: s.searchBox, placeholder: 'Search on Youtube'}}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(Search, s);
