/**
 * Created by Ben on 3/14/2016.
 */
import {fromJS} from 'immutable';

import {auth} from '../config';
import {SongTypes} from '../models/Song';
import {objectToQuerystring} from '../core/Utils';
import fetch from '../core/fetch';

export async function getSong(songId) {
  const baseUrl = 'http://api.soundcloud.com';
  let args = objectToQuerystring({
    client_id: auth.soundcloud.key,
    id: songId
  });
  let url = `${baseUrl}/tracks/${songId}?${args}`;
  let response = await fetch(url);
  response = await response.json();
  return fromJS(response).set('type', SongTypes.SOUNDCLOUD);
}

export async function findSongs(q) {
  const baseUrl = 'http://api.soundcloud.com';
  let args = objectToQuerystring({
    client_id: auth.soundcloud.key,
    q: q
  });
  let url = `${baseUrl}/tracks?${args}`;
  let response = await fetch(url);
  response = await response.json();
  return fromJS(response).map(result => result.set('type', SongTypes.SOUNDCLOUD));
}
