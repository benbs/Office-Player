/**
 * Created by Ben on 11/02/2015.
 */

var tag = $('<script src="https://www.youtube.com/iframe_api"></script>');
tag.insertBefore($('script')[0]);
var socket = io();


var officePlayer = new (Backbone.Model.extend({
  initialize: function () {
    var that = this;
    socket.emit("registerAsPlayer");
    socket.on("nowPlaying", function (id) {
      that.set({nowPlaying: id});
    });
    this.nowPlaying();
  },
  nowPlaying: function () {
    socket.emit("nowPlaying");
  },
  nextSong: function () {
    socket.emit("nextSong", this.get("nowPlaying"));
  }
}))();

var player;
function onYouTubeIframeAPIReady() {

  player = new YT.Player('player', {
    height: '390',
    width: '640',
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
function onPlayerReady(event) {
  officePlayer.get("nowPlaying") && player.loadVideoById(officePlayer.get("nowPlaying"));
  officePlayer.on("change:nowPlaying", function () {
    event.target.loadVideoById(officePlayer.get("nowPlaying"), 0, "large");
    event.target.playVideo();
    emitState();
  })
  socket.on("pause", function () {
    player.pauseVideo();
    emitState();
  });
  socket.on("play", function () {
    player.playVideo();
    emitState();
  });
  socket.on("changeVolume", function(vol) {
    player.setVolume(vol);
    emitState();
  })
  socket.on("mute", function() {
    player.mute();
    emitState();
  })
  socket.on("unMute", function() {
    player.unMute();
    emitState();
  })
  socket.on("requestState", function() {
    emitState(0);
  })
  socket.on("seek", function(time) {
    player.seekTo(time);
    emitState();
  })
  setInterval(emitState, 5000);
}

function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING) {
  }
  else if (event.data == YT.PlayerState.ENDED) {
    var url = player.getVideoUrl();
    var match = url.match(/[?&]v=([^&]+)/);
    officePlayer.nextSong(match[1]);
  }
}

function emitState(timeout) {
  var to = timeout || 1000;
  setTimeout(function() {
    socket.emit("playerState", {
      volume: player.getVolume(),
      isMuted: player.isMuted(),
      time: player.getCurrentTime(),
      isPaused: (player.getPlayerState() == 2)
    })
  }, to)

}