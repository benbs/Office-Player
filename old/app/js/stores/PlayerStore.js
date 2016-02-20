/**
 * Created by Ben on 30/05/2015.
 */
var Dispatcher = require('../AppDispatcher');
var assign = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var vars = require('../constants');
var _ = require('underscore');

var _playerState = {};

var _setPlayerState = function(state){
  _playerState = state;
};

var PlayerStore = assign({}, EventEmitter.prototype, {
  emitChange: function () {
    this.emit(vars.EVENTS.Change);
  },
  addChangeListener: function (callback) {
    this.on(vars.EVENTS.Change, callback);
  },
  removeChangeListener: function () {
    this.removeListener(vars.EVENTS.Change);
  },
  getPlayerState: function() {
    return _playerState;
  }
});

Dispatcher.register(function (action) {
  switch (action.actionType) {
    case vars.EVENTS.PlayerState:
      _setPlayerState(action.state);
      PlayerStore.emitChange();
      break;
  }
});
module.exports = PlayerStore;