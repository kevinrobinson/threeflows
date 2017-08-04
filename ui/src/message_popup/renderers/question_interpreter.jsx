/* @flow weak */
import React from 'react';

import MixedQuestion from '../renderers/mixed_question.jsx';
import ChoiceForBehaviorResponse from '../renderers/choice_for_behavior_response.jsx';
import MinimalOpenResponse from '../renderers/minimal_open_response.jsx';
import MinimalTextResponse from '../renderers/minimal_text_response.jsx';
import AudioCapture from '../../components/audio_capture.jsx';
import MinimalTimedView from '../renderers/minimal_timed_view.jsx';
import ApplesTextResponse from '../renderers/apples_text_response.jsx';


// This renders a question and an interaction, and strives towards being a
// general-purpose interpreter that over time ends up converging towards shared
// data structures/components across different scenarios.
export default React.createClass({
  displayName: 'QuestionInterpreter',
  
  propTypes: {
    question: React.PropTypes.object.isRequired,
    onLog: React.PropTypes.func.isRequired,
    onResponseSubmitted: React.PropTypes.func.isRequired,
    forceText: React.PropTypes.bool
  },

  getDefaultProps() {
    return {
      forceText: false
    };
  },

  render() {
    const {question, onLog, onResponseSubmitted} = this.props;
    return (
      <div>
        <MixedQuestion question={question} />
        {this.renderInteractionEl(question, onLog, onResponseSubmitted)}
      </div>
    );
  },

  renderInteractionEl(question, onLogMessage, onResponseSubmitted) {
    const key = JSON.stringify(question);
    const {forceText} = this.props;

    // Open response with audio by default, falling back to text if unavailable, and
    // allowing text responses to be forced.
    if (question.open) {
      if (forceText) {
        return <MinimalTextResponse
          key={key}
          forceResponse={question.force || false}
          responsePrompt=""
          recordText="Respond"
          ignoreText="Move on"
          onLogMessage={onLogMessage}
          onResponseSubmitted={onResponseSubmitted}
          />;
      } else {
        const buttonText = AudioCapture.isAudioSupported()
          ? "Click then speak"
          : "Respond";
        return <MinimalOpenResponse
          key={key}
          forceResponse={question.force || false}
          responsePrompt=""
          recordText={buttonText}
          ignoreText="Move on"
          onLogMessage={onLogMessage}
          onResponseSubmitted={onResponseSubmitted}
          />;
      }
    }

    // Double-log for reading back safely during group reviews
    if (question.applesSceneNumber !== undefined) {
      return <ApplesTextResponse
        key={key}
        applesSceneNumber={question.applesSceneNumber}
        forceResponse={question.force || false}
        responsePrompt=""
        recordText="Respond"
        ignoreText="Move on"
        onLogMessage={onLogMessage}
        onResponseSubmitted={onResponseSubmitted}
        />;
    }

    if (question.write) {
      return <MinimalTextResponse
        key={key}
        forceResponse={true}
        responsePrompt="Notes:"
        recordText="Next"
        onLogMessage={onLogMessage}
        onResponseSubmitted={onResponseSubmitted}
      />;
    }

    if (question.notes) {
      return <MinimalTextResponse
        key={key}
        textHeight={192}
        forceResponse={true}
        responsePrompt="Notes:"
        recordText="Next"
        onLogMessage={onLogMessage}
        onResponseSubmitted={onResponseSubmitted}
      />;
    }


    if (question.timedAutoAdvance) {
      return <MinimalTimedView
        key={key}
        recordText="Next"
        onLogMessage={onLogMessage}
        onResponseSubmitted={onResponseSubmitted}
      />;
    }


    if (question.choices && question.choices.length > 0) {
      return <ChoiceForBehaviorResponse
        key={key}
        choices={question.choices}
        onLogMessage={onLogMessage}
        onResponseSubmitted={onResponseSubmitted}
      />;
    }

    return <ChoiceForBehaviorResponse
      key={key}
      choices={['OK']}
      onLogMessage={onLogMessage}
      onResponseSubmitted={onResponseSubmitted}
    />;
  }
});