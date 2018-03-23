import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import RaidWeek from '../components/RaidWeek';

const PlayerDataWrapper = styled.section`
`;

const RaidWeekContainer = styled.div`
  width: 200px;
  height: 300px;
  border: 1px solid black;
  border-radius: 2px;
  margin: 0 5px;
`;

const RaidWeekHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 10%;
  font-size: ${({ raid }) => raid === 'nf' ? '17px' : '26px;'};
  text-align: center;
  vertical-align: middle;
  padding: 5px;
  background-color: white;
`;

const RaidStack = ({ handleFetchPGCR, raidWeek, raid }) => {
  const [week, raids] = raidWeek;
  const raidValues = Object.values(raids);

  const completedRaids = raidValues.filter(raid => raid.values.completionReason === 0);
  const failedRaids = raidValues.filter(raid => raid.values.completionReason !== 0);

  const test1 = raidValues.filter(raid => raid.values.completed === 1);
  const test2 = raidValues.filter(raid => raid.values.completed !== 1);

  //console.log('completed', completedRaids.length);
  //console.log('failed', failedRaids);
  //
  //console.log('completed t', test1.length);
  //console.log('failed t', test2.length);

  const name = week.split('-:-')[0];
  //console.log('week', week);
  //console.log('completedRaids', completedRaids);
  //Raids should have week start date in header instead of (W5).
  return(
    <PlayerDataWrapper>
      <RaidWeekContainer>
        <RaidWeekHeader raid={raid}>{ name }</RaidWeekHeader>
        <RaidWeek raid={raid} raids={completedRaids} handleFetchPGCR={handleFetchPGCR} />
        <RaidWeek success={false} raids={failedRaids} handleFetchPGCR={handleFetchPGCR} />
      </RaidWeekContainer>
    </PlayerDataWrapper>
  );
};

RaidStack.propTypes = {
  handleFetchPGCR: PropTypes.func.isRequired,
  raidWeek: PropTypes.array.isRequired,
  raid: PropTypes.string.isRequired
};

export default RaidStack;