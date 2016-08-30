/* @flow weak */
import React from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';

import StudentCard from './student_card.jsx';
import ExamplesCard from './examples_card.jsx';
import {questionId} from './question.js';


/*
This shows the full context of a Message Popup question, for use in scoring
or evaluating responses to it.
*/
export default React.createClass({
  displayName: 'MessagePopUp.ScoringQuestionContext',

  propTypes: {
    question: React.PropTypes.object.isRequired,
    indicator: React.PropTypes.object.isRequired
  },

  render() {
    const {question, indicator} = this.props;
    
    return (
      <div>
        <Card
          key="question"
          zDepth={2}
          initiallyExpanded={true}>
          <CardHeader
            title={`Question #${questionId(question)}`}
            actAsExpander={true}
            showExpandableButton={true}/>
          <CardText
            expandable={true}>
              <div>
                {this.renderQuestion(question)}
                {question.students && question.students.map(student => <StudentCard useCardStyles={true} key={`student-${student.id}`} student={student} />)}
              </div>
          </CardText>
        </Card>
        <Card key="indicator" zDepth={2}>
          <CardHeader
            title="Indicator"
            actAsExpander={true}
            showExpandableButton={true} />
          <CardText
            expandable={true}>{indicator.text}</CardText>
        </Card>
        {question.examples.length > 0 &&
          <ExamplesCard
            key="examples"
            titleText="Examples"
            examples={question.examples} />}
        {question.nonExamples.length > 0 &&
          <ExamplesCard
            key="non-examples"
            titleText="Non-examples"
            examples={question.nonExamples} />}
      </div>
    );
  },

  renderQuestion(question) {
    if (question.text) return <div style={{paddingBottom: 20}}>{question.text}</div>;
    if (question.youTubeId) {
      const url = `https://img.youtube.com/vi/${question.youTubeId}/0.jpg`;
      return (
        <div style={styles.videoContainer}>
          <img src={url} height={180} width="auto" />
        </div>
      );
    }
  }
});

const styles = {
  videoContainer: {
    width: '100%',
    background: 'black',
    textAlign: 'center'
  }
};