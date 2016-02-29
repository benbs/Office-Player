/**
 * Created by Ben on 2/22/2016.
 */
import React, {Component} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';

import s from './PlayerInfo.scss'

class PlayerInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={s.root}>
        a
      </div>
    );
  }
}

export default withStyles(PlayerInfo, s);
