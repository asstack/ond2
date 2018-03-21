import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import RaidWeek from '../components/RaidWeek';

const PlayerDataWrapper = styled.section`
  margin-top: 10px;
`;

const RaidWeekContainer = styled.div`
  width: 200px;
  height: 300px;
  border: 1px solid black;
  border-radius: 5px;
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
`;

const RaidStack = ({ handleFetchPGCR, raidWeek, raid }) => {
  const [week, raids] = raidWeek;
  const raidValues = Object.values(raids);

  const completedRaids = raidValues.filter(raid => raid.values.completionReason === 0);
  const failedRaids = raidValues.filter(raid => raid.values.completionReason !== 0);

  const name = week.split('-:-')[0];

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