import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import RaidWeek from '../components/RaidWeek';

const RaidWeekContainer = styled.div`
  width: 212px;
  height: fit-content;
  
  border-radius: 4px;
  background-color: #ffffff;
  border: solid 1px #e2e2e2;
  
  font-family: Montserrat;
  font-size: 16px;
  font-weight: normal;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #000000;
  
  @media only screen and (min-width: 340px) and (max-width: 400px) {
    margin-bottom: 15px;
  }
  
  @media only screen and (min-width: 400px) and (max-width: 750px) {
    margin-bottom: 15px;
  }
  
  @media only screen and (min-width: 750px) and (max-width: 1100px) {
    margin-bottom: 15px;
  }
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
  font-family: Montserrat;
  font-size: 14px;
  font-weight: bolder;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: bottom;
  color: #000000;
`;


const RaidStack = ({ handleFetchPGCR, raidWeek, raid, maxSuccessRaids, handleSetMaxSuccessRaids }) => {
  const [week, raids] = raidWeek;
  const raidValues = Object.values(raids);

  const completedRaids = raidValues.filter(raid => raid.values.completionReason === 0);
  const failedRaids = raidValues.filter(raid => raid.values.completionReason !== 0);

  const completedCount = Object.keys(completedRaids).length;

  if(completedCount > Math.abs(maxSuccessRaids)) {
    const currCount = maxSuccessRaids >= 14 ? Math.abs(maxSuccessRaids) / 2 : maxSuccessRaids;
    const incCount = completedCount >= 14 ? completedCount / 2 : completedCount;

    const incParsed = completedCount >= 14 ? (completedCount * -1) : completedCount;
    incCount > currCount ? handleSetMaxSuccessRaids(incParsed) : null;
  }


  const [name, date] = week.split(':D:');

  return(
    <RaidWeekContainer>
      <RaidWeekHeader raid={raid}>
        {name}
        <HeaderDate>{date}</HeaderDate>
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