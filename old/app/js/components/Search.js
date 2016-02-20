var React = require('react');
var _ = require('underscore');
var Combobox = require('./Combobox');
var PlaylistActions = require('../actions/PlaylistActions');
var $ = require('jquery');
var Socket = require('../Socket');

var Search = React.createClass({
  getInitialState: function () {
    return {data: []}
  },
  addSong: function (data) {
    this.props.addSong(data);
    $(".Combobox__input").focus();
    this.refs.combobox.setData([]);
    this.refs.combobox.setTextValue("");
  },
  handleChange: function (value, prevValue) {
    var valObj = this.refs.combobox.value();
    (typeof valObj === "string") ? this.handleSearch(value, prevValue) : this.addSong(valObj);
  },
  filterFunc: function (textValue, item) {
    return true;
  },
  handleSearch: _(function (value, prevValue) {
    var that = this;
    if (value == "") return;
    var baseURL = "https://www.googleapis.com/youtube/v3/search?part=snippet&key=AIzaSyAbCDkN41WFPVcCsLkYIjZjbmEdc4HF1uM&type=video,playlist&maxResults=10&q=";
    $.ajax({
      type: "GET",
      url: baseURL + encodeURIComponent(value),
      async: false,
      success: function (theData) {
        var mappedData = theData.items && theData.items.map(function (item) {
            item.label = item.snippet.title;
            item.image = item.snippet.thumbnails.default.url;
            item.type = item.id.kind;
            return item;
          });
        that.setState({data: mappedData});
        that.refs.combobox.setData(mappedData);
        that.refs.combobox.open();
      }
    });
  }).debounce(500),
  render: function () {
    var data = this.state.data;
    return (<div>
      <Combobox ref="combobox" data={data} onChange={this.handleChange} />
    </div>);
  }
});

module.exports = Search;