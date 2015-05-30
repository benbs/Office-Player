/**
 * Created by Ben on 09/02/2015.
 */

var express = require('express')
var app = express()
var http = require('http').Server(app)
var _und = require("underscore")

var io = require('socket.io')(http)
var middleware = require('socketio-wildcard')();
io.use(middleware);


var Playlist = require("./Playlist.js")
var api = require("./api.js")

var playlist = new Playlist()
api.initialize(io, playlist)

var staticFileOptions = {
  root: __dirname + '/',
  dotfiles: 'deny',
  headers: {
    'x-timestamp': Date.now(),
    'x-sent': true
  }
};

app.use('/static', express.static(__dirname + '/static'));

app.get('/', function (req, res) {
  res.sendFile('index.html', staticFileOptions);
})
app.get('/player', function (req, res) {
  res.sendFile('player.html', staticFileOptions);
});
app.get('/req', function (req, res) {
  res.sendFile('req.html', staticFileOptions);
});
app.get('/api/:call', function(req, res) {
  var call = req.params.call
  if (call == "help") {
    console.log("help..")
    var funcs = _und(api).keys().map(function(name) {
      var args = api[name].toString().split(")")[0].split("(")[1]
      return name+": ("+args+")"
    })
    funcs.unshift("<h1>Available Functions</h1>")
    res.end(funcs.join("<br />"))
  }
  else if (api[call]) {
    console.log("External api call!")
    var args = _und(req.query).values()
    var response = (args.length)? api[call].apply(api, args) : api[call].apply(api)
    console.log(response, typeof response)
    response && res.end(JSON.stringify(response))
  }
})

http.listen(8080, function () {
  console.log('Office server is now listening..')
})

io.on('connection', function (socket) {

  socket.on("*", function() {
    var args = arguments[0].data
    var call = args[0]
    if (call != "initialize" && api[call]) {
      args.shift()
      console.log("Calling API method "+call+" with params "+args)  
      var response = (args.length) ? api[call].apply(api, args) : api[call].apply(api)
      response && socket.emit(call, response)
    }
  })
  socket.on("registerAsPlayer", function () {
    socket.join('players')
    console.log("a new client has joined the server!")
  })
  socket.on("registerAsClient", function () {
    socket.join('clients')
    console.log("a new client has joined the server!")
  })
});