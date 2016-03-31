/**
 * Created by Ben on 2/22/2016.
 */
import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';
import cx from 'classnames';
import _ from 'lodash';
import {fromJS, List} from 'immutable';
import qs from 'qs';

import fetch from '../../core/fetch';
import {auth} from '../../config';
import {parseSong, SongTypes} from '../../models/Song';
import * as Soundcloud from '../../api/SoundcloudAPI';

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
    addSong(item.id, item.songType);
  }
  async getYoutubeResults(q) {
    let baseURL = "https://www.googleapis.com/youtube/v3/";
    let url = baseURL + 'search?' + qs.stringify({
        part: 'snippet',
        key: auth.youtube.key,
        type: 'video,playlist',
        maxResults: '10',
        q: q
      });
    let response = await fetch(url);
    response = await response.json();
    let ids = response.items.map(item => item.id.videoId).join(',');
    url = baseURL + 'videos?' + qs.stringify({
        part: 'snippet,contentDetails',
        id: ids,
        key: auth.youtube.key,
        type: 'video,playlist'
      });
    response = await fetch(url);
    response = await response.json();
    return fromJS(response.items).map(item => {
      return parseSong(item.set('type', SongTypes.YOUTUBE_SONG));
    });
  }
  async getSoundCloudResults(q) {
    let response = await Soundcloud.findSongs(q);
    return fromJS(response).map(item => {
      return parseSong(item.set('type', SongTypes.SOUNDCLOUD));
    })
  }
  multiplexResults(youtubeResults, soundcloudResults) {
    let newList  = new List();
    let ytItems = youtubeResults, scItems = soundcloudResults;
    while (ytItems.size > 0 || scItems.size > 0) {
      if (ytItems.size) {
        newList = newList.push(ytItems.first());
        ytItems = ytItems.shift();
      }
      if (scItems.size) {
        newList = newList.push(scItems.first());
        scItems = scItems.shift();
      }
    }
    return newList;
  }
  onChange = _.debounce(async (e, value) => {
    this.setState({loading: true});
    let youtubeResults = await this.getYoutubeResults(value);
    let scResults = await this.getSoundCloudResults(value);
    this.setState({results: this.multiplexResults(youtubeResults, scResults).toJS(), loading: false});
  }, 500);

  getSongTypeIcon(type) {
    switch(type) {
      case SongTypes.YOUTUBE_SONG:
      case SongTypes.YOUTUBE_PLAYLIST:
        return <i className="fa fa-youtube" />;
      case SongTypes.SOUNDCLOUD:
        return <i className="fa fa-soundcloud" />;
    }
  }

  renderItem(item, isHighlighted) {
    return (
      <div className={cx(s.item, {[s.highlightedItem]: isHighlighted})}
           key={item.id} id={item.id}>
        <div className={s.thumbnailWrapper}><img src={item.thumbnails.default.url} /></div>
        <span className={s.songTitle} dir="auto">
          {this.getSongTypeIcon(item.songType)} [{item.duration}] {item.title}
        </span>
      </div>
    );
  }
  render() {
    let bigWindow = !this.props.isMaster || this.props.isPlayer;
    let menuStyle = {
      borderRadius: '3px',
      boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
      background: 'rgba(255, 255, 255, 0.9)',
      padding: '2px 0',
      fontSize: '90%',
      zIndex: 3,
      position: 'absolute',
      overflow: 'auto',
      maxHeight: bigWindow ? '400px' : '200px'// TODO: don't cheat, let it flow to the bottom
    };
    return (
      <div className={s.root}>
        <span className={s.clearPlaylist} onClick={clearPlaylist}><i className="fa fa-trash" /></span>
        <div className={s.searchWrapper}>
          <Autocomplete
            ref="autocomplete"
            items={this.state.results}
            getItemValue={(item) => item.title}
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
