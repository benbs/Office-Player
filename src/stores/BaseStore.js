/**
 * Created by Ben on 2/14/2016.
 */
import EventEmitter from 'eventemitter3';
import * as config from '../config';

const CHANGE_EVENT = 'change';

class BaseStore extends EventEmitter {

  storeName = null;

  constructor(storeName) {
    super();
    this.storeName = storeName;
  }

  emitChange() {
    if (config.showEmitterEventLogs) {
      console.log("EMIT", this.storeName);
    }
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
}

export default BaseStore;
