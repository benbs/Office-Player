/**
 * Created by Ben on 28/05/2015.
 */
var SocketActions = require('./Socket');
SocketActions.init();
var React = require('react');
var OfficePlayer = require('./components/OfficePlayer');
var PlaylistActions = require('./actions/PlaylistActions');

React.render(<OfficePlayer />, document.getElementById("OfficePlayerApp"));

