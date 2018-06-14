import React from 'react';
import styled from 'styled-components';

import OND2Logo from './OND2Logo';

const LoaderWrapper = styled.div`

  width: 100%;
  height: 100%;
  
  position: fixed;
  top: 0;
  left: 0;
  
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  
  svg {
    position: absolute;
    top: 25%;
    left: calc(50% - 100px);
    margin-top: 50px;
    fill: black;
    width: 200px;
    height: 100px;
    animation: spin 1.5s ease infinite
  }
  
  div {
    width: 350px;
    text-align: center;
    font-size: 28px;
    position: absolute;
    top: 48%;
    left: calc(50% - 175px);
    
    p {
      margin-bottom: 10px;
      
      &:last-child {
        margin-top: 20px;
      }
    }
    
    @media only screen and (max-width: 450px) {
      width: 200px;
      font-size: 18px;
      left: calc(50% - 100px);
      top: 53%;
    }
  }
  
  @keyframes spin {
    0% {transform: rotateY(0deg)}
    100% {transform: rotateY(360deg)
  }
`;

const LogoLoader = ({ newPlayer = false }) => {
  return(
    <LoaderWrapper>
      <OND2Logo />
      { newPlayer &&
        <div>
          <p>Next time this will be fast,</p>
          <p>but for now we have to get</p>
          <p>your data from BUNGIE.</p>
          <p>Hang in there!</p>
        </div>
      }
    </LoaderWrapper>
  )
};

export default LogoLoader;