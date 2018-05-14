import React from 'react';
import styled from 'styled-components';
import { Message } from 'semantic-ui-react';

const MessageContainer = styled.div`  
  & :hover {
    cursor: pointer;
  }
`;

const UpdatePrompt = ({ clearUpdatePrompt }) => {
  return (
    <MessageContainer onClick={() => clearUpdatePrompt()}>
      <Message size="huge" info>
        <p>Click here to update to the latest version of OND2</p>
      </Message>
    </MessageContainer>
  )
};

export default UpdatePrompt;