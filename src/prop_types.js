import React from 'react';

/*
Defines common shapes of data.  Can moves this to Flow annotations over time.
*/
export const LearningObjective = React.PropTypes.shape({
  id: React.PropTypes.string.isRequired,
  competencyGroup: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired
});

export const Challenge = React.PropTypes.shape({
  id: React.PropTypes.number.isRequired,
  name: React.PropTypes.string.isRequired,
  scenario: React.PropTypes.string.isRequired,
  learningObjectives: React.PropTypes.arrayOf(LearningObjective).isRequired
});

export const User = React.PropTypes.shape({
  driveFolderId: React.PropTypes.string.isRequired
});