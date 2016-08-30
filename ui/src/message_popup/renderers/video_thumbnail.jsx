/* @flow weak */
import React from 'react';

/*
Renders an image thumbnail of a YouTube video, sized to take up the full space of its container.
*/
export default React.createClass({
  displayName: 'VideoThumbnail',

  propTypes: {
    youTubeId: React.PropTypes.string.isRequired,
    height: React.PropTypes.any,
    width: React.PropTypes.any
  },

  getDefaultProps() {
    return {
      height: '100%',
      width: '100%'
    };
  },

  render() {
    const {youTubeId, height, width} = this.props;
    const url = `https://img.youtube.com/vi/${youTubeId}/0.jpg`;
    return <img src={url} height={height} width={width} />;
  }
});

