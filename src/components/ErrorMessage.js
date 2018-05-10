import React from 'react';
import styled from 'styled-components';

const ErrorMessageContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 5;
  font-size: 18px;
  color: white;
  
  & p {
    margin-top: -50px;
  }
`;

const ErrorMessage = () => {
  return(
    <ErrorMessageContainer>
      <p>Something went wrong. Please reload and try again.</p>
    </ErrorMessageContainer>
  )
};

export default ErrorMessage;