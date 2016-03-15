/**
 * Created by Ben on 3/12/2016.
 */
import {Record, Map, List, fromJS} from 'immutable';
import {DEFAULT_SOUNDCLOUD_THUMBNAIL} from '../config';
import moment from 'moment';

export const SongTypes = {
  YOUTUBE_SONG: 0,
  YOUTUBE_PLAYLIST: 1,
  SOUNDCLOUD: 2
};

//function parseYoutubeDuration(duration) {
//  if (!duration) {
//    return 0;
//  }
//  let durationParts = duration.match(/(\d+)(?=[MHS])/ig) || [];
//
//  return durationParts.map(function (item) {
//    if (item.length < 2) {
//      return '0' + item;
//    }
//    return item;
//  }).join(':');
//}

function parseDuration(duration) {
  let m_duration = moment.utc(moment.duration(duration).asMilliseconds());
  return (m_duration.hours() > 0) ? m_duration.format('HH:mm:ss') : m_duration.format('mm:ss');
}

export function parseSong(songData) {
  //console.log(songData.toJS());
  switch(songData.get('type')) {
    case SongTypes.SOUNDCLOUD:
      return parseSoundCloudSong(songData);
    case SongTypes.YOUTUBE_SONG:
    default:
      return parseYoutubeSong(songData);
  }
}

function parseYoutubeSong(data) {
  let id = data.getIn(['id', 'videoId']) || data.get('id');
  return new Song({
    id: id,
    url: `https://www.youtube.com/watch?v=${id}`,
    songType: SongTypes.YOUTUBE_SONG,
    title: data.getIn(['snippet', 'title']),
    thumbnails: data.getIn(['snippet', 'thumbnails']),
    duration: parseDuration(data.getIn(['contentDetails', 'duration'])),
    relatedSongs: data.get('relatedSongs', new List())
  });
}

function parseSoundCloudSong(data) {
  return new Song({
    id: data.get('id'),
    url: data.get('permalink_url'),
    songType: SongTypes.SOUNDCLOUD,
    title: data.get('title'),
    thumbnails: fromJS({
      'default': {
        url: data.get('artwork_url') || DEFAULT_SOUNDCLOUD_THUMBNAIL,
      },
      high: {
        url: data.get('artwork_url')
      }
    }),
    duration: parseDuration(data.get('duration')),
    relatedSongs: new List()
  });
}

const SongRecord = Record({
  id: null,
  url: null,
  songType: null,
  title: null,
  thumbnails: null,
  duration: '00:00',
  relatedSongs: new List()
});

export default class Song extends SongRecord {
  toSmallMap() {
    return this.delete('relatedSongs');
  }
}
