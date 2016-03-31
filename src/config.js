/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

/* eslint-disable max-len */
/* jscs:disable maximumLineLength */

export const port = process.env.PORT || 8889;
export const host = process.env.WEBSITE_HOSTNAME || `localhost:${port}`;

export const showEmitterEventLogs = false;
export const showDispatchLogs = true;
export const showApiLogs = false;

export const analytics = {
  // https://analytics.google.com/
  google: { trackingId: process.env.GOOGLE_TRACKING_ID || 'UA-XXXXX-X' }

};

export const auth = {

  // https://developers.facebook.com/
  facebook: {
    id: process.env.FACEBOOK_ID || '183246425378777',
    secret: process.env.FACEBOOK_SECRET || 'cb2b201f0249d15454221cbf00d6ff99'
  },

  youtube: {
    key: 'AIzaSyDpf1zpnEIu2otoq_jERitTBXn-O3yJ9bg'
  },

  soundcloud: {
    key: 'd72413ab5801eefae147858ff355b901'
  }

};

export const DEFAULT_SOUNDCLOUD_THUMBNAIL = 'http://www.brandsoftheworld.com/sites/default/files/styles/logo-thumbnail/public/032013/soundcloud_logo_0.png?itok=xO8Oaxwr';
