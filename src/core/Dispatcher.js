/**
 * Created by Ben on 2/14/2016.
 */
import {Dispatcher} from 'flux';
import * as config from '../config';

function handleExceptions(f) {
  return function() {
    try {
      f.apply(this, arguments);
    } catch(e) {
      console.error(e.stack);
    }
  }
}

let dispatcher = Object.assign(new Dispatcher(), {
  dispatch: function(action) {
    if (config.showDispatchLogs) {
      console.log("DISPATCH", action.type, action);
    }
    Dispatcher.prototype.dispatch.call(this, action);
  },
  register: function(callback) {
    return Dispatcher.prototype.register.call(this, handleExceptions(callback));
  }
});

export default dispatcher;
