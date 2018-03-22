import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ScoreWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
`;

const ScoreView = ({ score, teamScore }) => {
  return (
    <ScoreWrapper>
      <p>{`${score}%` }</p>
      <p style={{ fontWeight: 'bold' }}>{teamScore}</p>
    </ScoreWrapper>
  )
};

ScoreView.propTypes = {
  score: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  teamScore: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
export default ScoreView;