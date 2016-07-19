/* @flow weak */
import React from 'react';
import ReactDOM from 'react-dom';
import TestUtils from 'react-addons-test-utils';
import MessageEvaluationCard from '../src/message_popup/message_evaluation_card.jsx';

jest.unmock('../src/message_popup/message_evaluation_card.jsx');

describe('MessageEvaluationCard', () => {
  it('renders colors', () => {
    const evaluation = {
      email: 'kevin.robinson.0@gmail.com',
      scoreValue: 0,
      scoreComment: 'foo'
    };
    const card = TestUtils.renderIntoDocument(
      <MessageEvaluationCard evaluation={evaluation} />
    );
    const el = ReactDOM.findDOMNode(card);
    expect(MessageEvaluationCard).toBe('wat');
    expect(card).toBe('bar');
    expect(el.styles).toBe('foo');
  });
});