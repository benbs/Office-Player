/**
 * Created by Ben on 2/20/2016.
 */
import {youtube} from 'googleapis';
import {fromJS, List} from 'immutable';

import {auth} from '../config';
import {SongTypes} from '../models/Song';

const youtubeInstance = youtube('v3');

export function getSong(songId) {
  return new Promise((resolve, reject) => {
    let args = {
      id: songId,
      part: 'snippet,contentDetails',
      type: 'video',
      auth: auth.youtube.key
    };

    youtubeInstance.videos.list(args, async (err, response) => {
      if (!err && response.items.length) {
        let songData = fromJS(response.items[0]);
        songData = songData.set('relatedSongs', new List());
        try {
          songData = songData.set('relatedSongs', await getRelatedSongs(songId));
        }
        catch (err) {
          console.log(`couldnt get related songs - ${err}`);
        }
        songData = songData.set('type', SongTypes.YOUTUBE_SONG);
        resolve(songData);
      }
      else {
        reject(err || 'no song found!');
      }
    });
  });
}

export function getPlaylist(playlistId) {
  return new Promise((resolve, reject) => {
    let args = {
      playlistId: playlistId,
      part: 'snippet',
      maxResults: 50,
      auth: auth.youtubeInstance.key
    };
    youtubeInstance.playlistItems.list(args, (err, response) => {
      if (!err && response.items.length) {
        resolve(fromJS(response.items));
      }
      else {
        reject(err || 'no playlist found!');
      }
    });
  });
}

export function getRelatedSongs(songId) {
  return new Promise((resolve, reject) => {
    let args = {
      part: "snippet",
      type: "video",
      relatedToVideoId: songId,
      maxResults: 10,
      auth: auth.youtube.key
    };
    youtubeInstance.search.list(args, (err, response) => {
      if (!err && response.items.length) {
        resolve(fromJS(response.items));
      }
      else {
        reject(err || 'no song found!');
      }
    });
  });
}
