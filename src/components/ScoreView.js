import React from 'react';
import PropTypes from 'prop-types';

const ScoreView = ({ score, teamScore }) => {
  return (<p><b>{teamScore}</b> {`(${score})` }</p>)
};

ScoreView.propTypes = {
  score: PropTypes.number.isRequired,
  teamScore: PropTypes.number.isRequired
};
export default ScoreView;