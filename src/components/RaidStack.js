import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import RaidWeek from '../components/RaidWeek';

const RaidWeekContainer = styled.div`
  width: 100%;
  max-width: 212px;
  display: inline-block;  
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #e2e2e2;
  
  font-family: Montserrat sans-serif;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #000000;
`;

const RaidWeekHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 49px;
  font-size: 16px;
  padding: 5px;
  background-color: white;
`;

const HeaderDate = styled.span`
  margin: 0 0 0 5px;
  font-family: Montserrat sans-serif;
  font-size: 14px;
  font-weight: bolder;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: match-parent;
  color: #000000;
`;

const RaidStack = ({ handleFetchPGCR, viewRaid, raidWeek, raid, maxSuccessRaids, handleSetMaxSuccessRaids, weekTitle }) => {
  const [week, raids] = raidWeek;
  const raidValues = Object.values(raids);

  const completedRaids =
    viewRaid === 'nf' ?
      raidValues.filter(raid => raid.values.completionReason === 0)
      : raidValues.filter(raid => raid.values.timePlayedSeconds >= 300 && raid.values.completed === 1 && raid.values.completionReason === 0);

  const failedRaids =
    viewRaid === 'nf' ?
      raidValues.filter(raid => raid.values.completionReason !== 0)
        : raidValues.filter(raid => raid.values.timePlayedSeconds >= 300 && raid.values.completed !== 1 && raid.values.completionReason !== 0);

  const completedCount = Object.keys(completedRaids).length;

  if(completedCount > Math.abs(maxSuccessRaids)) {
    const currCount = maxSuccessRaids >= 14 ? Math.abs(maxSuccessRaids) / 2 : maxSuccessRaids;
    const incCount = completedCount >= 14 ? completedCount / 2 : completedCount;

    const incParsed = completedCount >= 14 ? (completedCount * -1) : completedCount;
    incCount > currCount ? handleSetMaxSuccessRaids(incParsed) : null;
  }

  const [date, name] = viewRaid === 'nf' ? weekTitle : week.split(':D:').reverse();

  return(
    <RaidWeekContainer>
      <RaidWeekHeader raid={raid}>
        {name}
        <HeaderDate>{date.substring(0, 5)}</HeaderDate>
      </RaidWeekHeader>
      <RaidWeek raid={raid} raids={completedRaids} maxCount={maxSuccessRaids} handleFetchPGCR={handleFetchPGCR} />
      <RaidWeek success={false} raids={failedRaids} handleFetchPGCR={handleFetchPGCR} />
    </RaidWeekContainer>
  );
};

RaidStack.propTypes = {
  handleFetchPGCR: PropTypes.func.isRequired,
  raidWeek: PropTypes.array.isRequired,
  raid: PropTypes.string.isRequired
};

export default RaidStack;