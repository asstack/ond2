import React from 'react';
import styled from 'styled-components';
// import DestinyLoaderWrapper from './StyledDestinyLoader';

const DestinyLogoSVG = () => (
  <svg viewBox="118.5 60 105 105">
  <g>
    <path id="logo-wings" d="M155.1,72.9c0.1,7.8,0,15.3,0,23.8c0,2.5-0.1,5.1,0,7.4c0.6,11.4,10.6,19.8,21.4,15.6c5.2-2,9.5-6.9,10.3-13.7
      c0.5-4.2,0.1-10.7,0.1-16.4c0-3.8,0-8.1,0-12.4c0-1.2-0.1-3.3,0-4.1c0,0,2.9-1.7,3.5-2.1c3.5-2.2,6.3-4.7,10.6-6
      c7-2.1,12.5,1.7,15.6,5.2c3.5,3.9,5.8,10.6,3.6,17.5c-1.8,5.8-6.2,8.5-10.6,11.7c-8.4,6.3-14.9,14.7-18.9,25.9
      c-1.9,5.4-3.1,12.4-3.7,18.9c-0.4,3.8-0.6,7-1.7,9.8c-2,5.1-6,9.3-12,10.1c-10.2,1.4-16.4-5.7-17.8-15.2c-0.5-3.6-0.6-7.1-1.1-10.5
      c-2.2-16.5-9.4-28.6-19.4-37c-6-5.1-14.2-8.5-14-19.7c0.1-3.5,1.1-6.6,2.4-8.9c2.6-4.5,7.1-8.5,13.8-8.6
      C145.2,64.4,149.1,69.7,155.1,72.9z"
    />
    <path id="logo-pill" d="M170.6,73.3c5.3-0.4,9.8,3.7,10.8,8.8c0.6,2.9,0.2,8.4,0.2,11.5c0,3.7,0.3,8.2-0.1,11.6c-0.4,3.8-2.3,6.5-4.5,8.1
      c-6.5,4.6-15.7,0.5-16.5-8.5c-0.4-4.2,0-8.2,0-12.3c0-4-0.4-8.8,0.6-11.7C162.3,77,165.7,73.6,170.6,73.3z"
    />
  </g>
  </svg>
);

const DestinyOverlay = styled.div`
  width: 100%;
  height: 100%;
  
  position: absolute;
  top: 0;
  left: 0;
  
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  background: #232526;
  background: -webkit-linear-gradient(to bottom, #232526, #414345);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #232526, #414345); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
`;

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
    margin-top: 20%;
    fill: black;
    width: 100px;
    height: 100px;
    animation: spin 1.5s ease infinite
  }
 
  
  @keyframes spin {
    0% {transform: rotate(0deg)}
    100% {transform: rotate(360deg)
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