/* @flow weak */
import React from 'react';

import * as Colors from 'material-ui/styles/colors';
import {Card, CardText} from 'material-ui/Card';


/*
Pure UI component showing a response to a question.
*/
export default React.createClass({
  displayName: 'MessageResponseCard',

  propTypes: {
    log: React.PropTypes.object.isRequired,
    extendStyle: React.PropTypes.object
  },

  render() {
    const {log, extendStyle} = this.props;
    const style = {...styles.itemCard, ...extendStyle};

    return (
      <Card key="competency" style={style}>
        <CardText style={{fontSize: 16}}>
          {this.renderResponseContent(log)}
        </CardText>
      </Card>
    );
  },

  renderResponseContent(log) {
    const {elapsedMs, initialResponseText, audioUrl} = log.json;

    if (initialResponseText) {
      return (
        <div>
          <div>{initialResponseText}</div>
          <div style={styles.responseLatency}>{`${Math.round(elapsedMs/1000)} seconds`}</div>
        </div>
      );
    }

    // TODO(kr) uploadedUrl
    if (audioUrl.uploadedUrl) {
      return (
        <div>
          <div><audio controls={true} src={audioUrl.uploadedUrl} /></div>
          <div style={styles.responseLatency}>{`${Math.round(elapsedMs/1000)} seconds`}</div>
        </div>
      );
    }
  }
});

const styles = {
  itemCard: {
    borderBottom: '1px solid #eee',
    margin: 0
  },
  responseLatency: {
    marginTop: 10,
    color: Colors.grey500
  }
};