import React from 'react';
import styled from 'styled-components';
import shortid from 'shortid';
import { fetchPostGameCarnageReport } from "../services/destiny-services";

const RaidWeekContainer = styled.div`
  width: 200px;
  height: 300px;
  border: 1px solid black;
  margin: 0 5px;
`;

const RaidWeekHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 10%;
  font-size: 26px;
  text-align: center;
  vertical-align: middle;
  padding: 5px;
`;

const RaidWeek = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${({ fails }) => fails ? 'flex-start' : 'flex-end'};
  align-items: center;
  height: 45%;
  border-top: 1px solid black;
`;

const RaidStackList = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
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

const RaidStack = ({ handleShowStats, handleFetchPGCR, raidWeek }) => {
  const [week, raids] = raidWeek;
  const raidValues = Object.values(raids);
  const completedRaids = raidValues.filter(raid => raid.values.completed);
  const failedRaids = raidValues.filter(raid => !raid.values.completed);

  return(
      <RaidWeekContainer>
        <RaidWeekHeader>{ week }</RaidWeekHeader>
        <RaidWeek>
          { completedRaids && Object.values(completedRaids).map(raid => (
            <RaidStackItems
              onClick={() => {
                handleShowStats(raid.values);
                handleFetchPGCR(raid.activityDetails.instanceId)
              }}
              key={shortid.generate()}
              activityCount={1}
              success={raid.values.completed}>
              <RaidStackItem />
            </RaidStackItems>
          ))
          }
        </RaidWeek>
        <RaidWeek fails >
          { failedRaids && Object.values(failedRaids).map(raid => (
            <RaidStackItems
              onClick={() => handleShowStats(raid.values)}
              key={shortid.generate()}
              activityCount={1}
              success={raid.values.completed}>
              <RaidStackItem />
            </RaidStackItems>
          ))
          }
        </RaidWeek>
      </RaidWeekContainer>
  );
};

const RaidWeekViewer = ({ raidHistory : { mergedHistory = {EOW: false} }, handleShowStats, handleFetchPGCR }) => {
  const raidWeeks = Object.entries(mergedHistory.EOW).reverse().slice(1, 6).reverse();
  return (
    raidWeeks && (
      <RaidStackList>
        { raidWeeks.map(raidWeek =>
          <RaidStack
            key={shortid.generate()}
            handleShowStats={handleShowStats}
            handleFetchPGCR={handleFetchPGCR}
            raidWeek={raidWeek} />) }
      </RaidStackList>
    )
  )
};

export default RaidWeekViewer;