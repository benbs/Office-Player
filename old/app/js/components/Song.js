var React = require('react');
var PlaylistActions = require('../actions/PlaylistActions');
var Song = React.createClass({
  deleteSong: function () {
    PlaylistActions.deleteSong(this.props.data.id);
  },
  render: function () {
    var data = this.props.data;
    var thumbnail = data.snippet.thumbnails.default.url;
    var title = data.snippet.title;
    var songClass = "song";
    var duration = data.contentDetails.duration
      .replace("PT", "").replace("S", "").replace("H", ":").replace("M", ":").split(":");
    duration.forEach(function(pt, i) { duration[i] = (pt.length == 1)? "0"+pt : pt });
    duration = duration.join(":");

    if (this.props.isPlaying) songClass += " playing";
    if (this.props.isSelected) songClass += " selected";
    return (
      <div className={songClass} onClick={this.props.onClick} onDoubleClick={this.props.changeSong}>
        <img src={thumbnail}/>
        <button className="btn remove-song" onClick={this.deleteSong}>X</button>
        <span dir="auto">{title}</span>
        <div className="duration">{duration}</div>
      </div>
    );
  }
});

module.exports = Song;