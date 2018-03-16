import React from 'react';
import styled from 'styled-components';

import DestinyLogoSVG from './DestinyLogoSVG';

const DestinyLoaderWrapper = styled.div`

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
    margin-top: 15%;
    fill: black;
    width: 100px;
    height: 100px;
    animation: spin 1.5s ease infinite
  }
  
  @keyframes spin {
    0% {transform: rotateY(0deg)}
    100% {transform: rotateY(360deg)
  }
`;

const DestinyLoader = () => {
  return(
    <DestinyLoaderWrapper>
      <DestinyLogoSVG />
    </DestinyLoaderWrapper>
  )
};

export default DestinyLoader;