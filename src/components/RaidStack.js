import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import RaidWeek from '../components/RaidWeek';

const RaidWeekContainer = styled.div`
  width: 212px;
  height: 650px;
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
    height: 100%;
  }
  
  @media only screen and (min-width: 400px) and (max-width: 750px) {
    height: 100%;
  }
  
  @media only screen and (min-width: 750px) and (max-width: 1250px) {
    height: 100%;
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

const RaidStack = ({ handleFetchPGCR, raidWeek, raid }) => {
  const [week, raids] = raidWeek;
  const raidValues = Object.values(raids);

  const completedRaids = raidValues.filter(raid => raid.values.completionReason === 0);
  const failedRaids = raidValues.filter(raid => raid.values.completionReason !== 0);

  // const test1 = raidValues.filter(raid => raid.values.completed === 1);
  // const test2 = raidValues.filter(raid => raid.values.completed !== 1);

  //console.log('completed', completedRaids.length);
  //console.log('failed', failedRaids);
  //
  //console.log('completed t', test1.length);
  //console.log('failed t', test2.length);

  const [name, date] = week.split(':D:');
  //console.log('week', week);
  //console.log('completedRaids', completedRaids);
  //Raids should have week start date in header instead of (W5).
  return(
    <RaidWeekContainer>
      <RaidWeekHeader raid={raid}>
        {name}
        <HeaderDate>{date}</HeaderDate>
      </RaidWeekHeader>
      <RaidWeek raid={raid} raids={completedRaids} handleFetchPGCR={handleFetchPGCR} />
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