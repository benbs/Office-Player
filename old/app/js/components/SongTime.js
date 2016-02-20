/**
 * Created by Ben on 30/05/2015.
 */
var React = require('react');
var ReactSlider = require('react-slider');
var PlaylistActions = require('../actions/PlaylistActions');

var SongTime = React.createClass({
  getInitialState: function () {
    return {time: 0, pause: false};
  },
  componentDidMount: function () {
    setInterval((function () {
      !this.state.pause && this.setState({time: this.state.time + 1});
    }).bind(this), 1000)
  },
  componentWillReceiveProps: function (newProps) {
    this.setState({time: parseInt(newProps.time), pause: newProps.isPaused});
  },
  onSliderClick: function () {
    this.setState({pause: true});
  },
  seek: function (time) {
    this.setState({time: time});
    PlaylistActions.seek(time);
  },
  formatTime: function (time) {
    if (!time) {
      return "00:00:00";
    }
    var sec_num = parseInt(time, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
  },
  render: function () {
    var time = this.formatTime(this.state.time);
    return (
      <div onClick={this.onSliderClick} id="song-time">
        <ReactSlider className="horizontal-slider"
                     max={this.props.duration}
                     value={this.state.time}
                     withBars={true}
                     invert={false}
                     onAfterChange={this.seek}
          />
        {time}
      </div>
    )
  }
});

module.exports = SongTime;