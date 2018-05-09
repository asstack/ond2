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
  background-color: rgba(255, 255, 255, 0.3);
`;

const ErrorMessage = () => {
  return(
    <ErrorMessageContainer>
      <p>Yeah we suck, sorry.</p>
    </ErrorMessageContainer>
  )
};

export default ErrorMessage;