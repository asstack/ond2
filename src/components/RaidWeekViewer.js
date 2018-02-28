import React from 'react';
import styled from 'styled-components';

const RaidWeekContainer = styled.div`
  width: 200px;
  height: 300px;
  border: 1px solid black;
`;

const RaidWeekHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 10%;
  font-size: 26px;
  text-align: center;
  vertical-align: middle;
`;

const RaidWeekCompletions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 40%;
  border-top: 1px solid black;
`;

const RaidWeekFailures = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  height: 40%;
  border-top: 1px solid black;
`;

const RaidStackList = styled.div`
  width: 70%;
  border-bottom: 1px solid black;
  border-right: 1px solid black;
`;

const RaidStackItems = styled.div`
  display: flex;
  flex-direction: row;
  height: 20px;
  ${({ success }) => success ? 'margin-bottom: -1px' : null};
  ${({ success }) => success ? null: 'margin-top: -1px'};
  
  & > div {
    background-color: ${({ success }) => !!success ? 'green' : 'red'};
    width: ${({ activityCount }) => (100 / activityCount)}%;
  }
`;

const RaidStackItem = styled.div`
  && {
    ${({ na }) => na ? 'background-color: gray' : null};
  }
  height: 100%;
  border-left: 1px solid black;
  border-top: 1px solid black;
`;


const RaidStack = ({ raids, success }) => {
  const count = 5
  return (
    <RaidStackList>
      <RaidStackItems success={success} activityCount={6} >
        <RaidStackItem na />
        <RaidStackItem na />
        <RaidStackItem na />
        <RaidStackItem />
        <RaidStackItem />
        <RaidStackItem />
      </RaidStackItems>
      <RaidStackItems success={success} activityCount={6}>
        <RaidStackItem na />
        <RaidStackItem na />
        <RaidStackItem />
        <RaidStackItem />
        <RaidStackItem />
        <RaidStackItem />
      </RaidStackItems>
      <RaidStackItems success={success} activityCount={6}>
        <RaidStackItem na />
        <RaidStackItem />
        <RaidStackItem />
        <RaidStackItem />
        <RaidStackItem />
        <RaidStackItem />
      </RaidStackItems>
    </RaidStackList>
  );
};

const RaidWeekViewer = ({ raidHistory }) => {
  const charId = 2305843009260680049;

  return (
    <RaidWeekContainer>
      <RaidWeekHeader>Current</RaidWeekHeader>
      <RaidWeekCompletions>
        <RaidStack success />
      </RaidWeekCompletions>
      <RaidWeekFailures>
        <RaidStack />
      </RaidWeekFailures>
    </RaidWeekContainer>
  )
};

export default RaidWeekViewer;