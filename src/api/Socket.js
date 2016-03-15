/**
 * Created by Ben on 2/25/2016.
 */
import io from 'socket.io-client';

let socket = null;

class Socket {
  init() {
    socket = io();
  }

  emit(event, data) {
    let args = Array.slice(arguments);
    args.shift();
    if (socket) {
      socket.emit(event, ...args);
    }
    else {
      console.error('socket is not ready yet');
    }
  }

  on(event, callback) {
    if (socket) {
      socket.on(event, callback);
    }
    else {
      console.error('socket is not ready yet');
    }
  }

  reorderList(newList) {
    let idsList = newList.map(song => song.id);
    this.emit('reorderList', idsList);
  }
}

const instance = new Socket();
export default instance;
