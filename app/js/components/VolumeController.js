/**
 * Created by Ben on 30/05/2015.
 */

var React = require('react');
var ReactSlider = require('react-slider');
var PlaylistActions = require('../actions/PlaylistActions');

var VolumeController = React.createClass({
  changeVolume: function(vol) {
    PlaylistActions.changeVolume(vol);
  },
  render: function () {
    return (
      <div id="volume">
        {(!this.props.mute) ?
          <button className="btn btn-danger" onClick={this.props.onMute}>
            <i className="fa fa-volume-up"/>
          </button> :
          <button className="btn btn-danger" onClick={this.props.onUnMute}>
            <i className="fa fa-volume-off"/>
          </button> }
        <div className="slider-wrapper">
          <ReactSlider className="vertical-slider"
                       value={[this.props.volume]}
                       orientation='vertical'
                       withBars={true}
                       invert={true}
                       onAfterChange={this.changeVolume}
            />
        </div>
      </div>
    )
  }
});

module.exports = VolumeController;