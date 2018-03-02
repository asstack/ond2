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
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const RaidStackItems = styled.div`
  display: flex;
  flex-direction: row;
  height: 20px;
  width: 100%;
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

/*
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
 */

const RaidStack = ({ raid }) => {
  console.log('raid', raid);
  return (
    <RaidWeekContainer>
      <RaidWeekHeader>Current</RaidWeekHeader>
      <RaidWeekCompletions>
        <RaidStackItems activityCount={1} success>
          <RaidStackItem />
        </RaidStackItems>
      </RaidWeekCompletions>
      <RaidWeekFailures>
        <RaidStackItems success>
          <RaidStackItem />
        </RaidStackItems>
      </RaidWeekFailures>
    </RaidWeekContainer>
  );
};

const RaidWeekViewer = ({ raidHistory : { mergedHistory = {EOW: false} } }) => {
  const raidData = mergedHistory.EOW && mergedHistory.EOW.reverse();
  console.log('mergedHistory', raidData);
  return (
     raidData && (
       <RaidStackList>
        { raidData.map((curr) => <RaidStack raid={curr} />) }
       </RaidStackList>
  ))
};

export default RaidWeekViewer;