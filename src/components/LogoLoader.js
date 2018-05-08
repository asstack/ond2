import React from 'react';
import styled from 'styled-components';

import OND2Logo from './OND2Logo';

const LoaderWrapper = styled.div`

  width: 100%;
  height: 100%;
  
  position: absolute;
  top: 0;
  left: 0;
  
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  
  svg {
    position: absolute;
    top: 25%;
    left: calc(50% - 50px);
    margin-top: 50px;
    fill: black;
    width: 100px;
    height: 100px;
    animation: spin 1.5s ease infinite
  }
  
  div {
    width: 300px;
    text-align: center;
    font-size: 14px;
    position: absolute;
    top: 48%;
    left: calc(50% - 150px);
  }
  
  @keyframes spin {
    0% {transform: rotateY(0deg)}
    100% {transform: rotateY(360deg)
  }
`;

const LogoLoader = () => {
  return(
    <LoaderWrapper>
      <OND2Logo />
      <div>
        <p>Aggregating data...</p>
        <p>We'll keep it up to date behind the scenes</p>
      </div>
    </LoaderWrapper>
  )
};

export default LogoLoader;