/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-2016 Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import 'babel-polyfill';
import path from 'path';

import express from 'express';
import http from 'http';
import SocketIO from 'socket.io';
import SocketIOWildcard from 'socketio-wildcard';

import React from 'react';
import _ from 'lodash';
import ReactDOM from 'react-dom/server';
import Router from './routes';
import Html from './components/Html';
//noinspection JSFileReferences
import assets from './assets';
import { port, showApiLogs } from './config';

import PlayerAPI from './api/PlayerAPI';

const app = global.server = express();

const server = http.createServer(app);
const io = SocketIO(server);
io.use(SocketIOWildcard());

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

//
// Register API middleware
// -----------------------------------------------------------------------------
//app.use('/api/content', require('./api/external').default);

app.get('/api/:call', async (req, res) => {
  var call = req.params.call;
  if (call == "help") {
    console.log("help..");
    let funcs = Object.getOwnPropertyNames(PlayerAPI).map((name) => {
      console.log(name);
      var args = api[name].toString().split(")")[0].split("(")[1];
      return name+": ("+args+")"
    });
    funcs.unshift("<h1>Available Functions</h1>");
    res.end(funcs.join("<br />"))
  }
  else if (api[call]) {
    showApiLogs && console.log(`External api call - ${call}`);
    var args = _.values(req.query);
    let response;
    try {
      if (args.length) {
        response = await api[call].call(api, ...args);
      }
      else {
        response = await api[call].call(api);
      }
    }
    catch (err) {
      console.error(err.stack);
      response = {Error: err.message}
    }
    try {
      res.end(JSON.stringify(response))
    }
    catch(err) {
      res.end(response);
    }
  }
});

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
const api = new PlayerAPI(io);

app.get('*', async (req, res, next) => {
  try {
    let statusCode = 200;
    const data = { title: '', description: '', css: '', body: '', entry: assets.main.js };
    const css = [];
    const context = {
      insertCss: styles => css.push(styles._getCss()),
      onSetTitle: value => data.title = value,
      onSetMeta: (key, value) => data[key] = value,
      onPageNotFound: () => statusCode = 404,
    };

    await Router.dispatch({ path: req.path, query: req.query, context }, (state, component) => {
      data.body = ReactDOM.renderToString(component);
      data.css = css.join('');
    });

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(statusCode).send(`<!doctype html>\n${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Register Websockets handlers
// -----------------------------------------------------------------------------
io.on('connection', function (socket) {

  socket.on("*", async (message) => {
    var args = message.data;
    var call = args[0];
    if (call != "initialize" && api[call]) {
      args.shift();
      try {
        var response = (args.length) ? await api[call].apply(api, args) : await api[call].apply(api);
      }
      catch(err) {
        console.error(err.stack);
      }
      showApiLogs && console.log(`API method ${call} with params ${args} returned ${response}`);
      response && socket.emit(call, response)
    }
  });
  socket.on('setMaster', () => {
    if (!api.masterSocketId) {
      api.masterSocketId = socket.id;
      console.log('master player is ' + api.masterSocketId);
      socket.emit('setMaster', true);
      io.emit('hasMaster', true);
    }
  });
  socket.on('disconnect', () => {
    if (api.masterSocketId === socket.id) {
      api.masterSocketId = null;
      io.emit('hasMaster', false);
    }
  });
});

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});
