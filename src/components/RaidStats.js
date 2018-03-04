import React, { Component } from 'react';
import styled from 'styled-components';

const RaidStatsContainer = styled.div`
  width: 80%;
  height: 300px;
  margin-top: 20px;
  border: 1px solid black;
`;

const RaidStats = ({ children }) => {
  return (
    <RaidStatsContainer>
      { children }
    </RaidStatsContainer>
  )

};

export default RaidStats;