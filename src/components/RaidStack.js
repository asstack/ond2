import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Icon, Grid, Popup } from 'semantic-ui-react';
import { CLASS_MAP } from '../actions/index';

import RaidWeek from '../components/RaidWeek';

const RaidWeekContainer = styled.div`
  width: 100%;
  max-width: 212px;
  display: inline-block;  
  background-color: #ffffff;
  
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
  padding-right: 5px;
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

const CharacterCompletions = styled.div`
  display: flex;
  justify-content: start;
  margin-top: 4px;
`;

// Non-applicable raids
// 1. Fewer than 6 characters in the raid.
// 2. Not longer than 5 minutes. - activityDurationSeconds > (60 * 5)
// 3. No kill - Individual

const isApplicableRaid = (raid) => {
  return (
    raid.teamCount >= 6 &&
    raid.values.activityDurationSeconds >= (60 * 5) &&
    raid.values.kills > 0
  )
};

const RaidStack = ({ characterActivities, handleSetFarmCount, handleFetchPGCR, viewRaid, raidWeek, raid, characters, maxSuccessRaids, handleSetMaxSuccessRaids, weekTitle }) => {
  const [week, raids] = raidWeek;
  const raidValues = Object.values(raids);

  characterActivities
  const completedRaids =
    (viewRaid === 'nf' || viewRaid === 'ep') ?
      raidValues.filter(raid => raid.values.completionReason === 0 && raid.values.completed === 1)
      : raidValues.filter(raid => raid.values.timePlayedSeconds >= 300 && raid.values.completed === 1 && raid.values.completionReason === 0);

  const failedRaids =
    (viewRaid === 'nf' || viewRaid === 'ep') ?
      raidValues.filter(raid => raid.values.completionReason !== 0 && raid.values.completed !== 1)
        : raidValues.filter(raid => (raid.values.timePlayedSeconds < 300 || raid.values.completed !== 1 || raid.values.completionReason !== 0) && isApplicableRaid(raid));

  const completedCount = Object.keys(completedRaids).length;

  if(completedCount > Math.abs(maxSuccessRaids)) {
    const currCount = maxSuccessRaids >= 14 ? Math.abs(maxSuccessRaids) / 2 : Math.abs(maxSuccessRaids);
    const incCount = completedCount >= 14 ? completedCount / 2 : completedCount;
    const incParsed = completedCount >= 14 ? (completedCount * -1) : completedCount;

    incCount > currCount ? handleSetMaxSuccessRaids(incParsed) : null;
  }

  const characterCompletions = Object.values(characterActivities).reduce((accum, curr) => {
    accum[curr[0]] = completedRaids.reduce((complete, activity) => {
      if(curr.indexOf(activity.instanceId) >= 0) {
        complete = true;
      }
      return complete;
    }, false);

    if(!accum[curr[0]]) {
      accum[curr[0]] = failedRaids.reduce((fail, activityF) => {
        if(fail === 'n/a' && curr.indexOf(activityF.instanceId) >= 0) {
          fail = false
        }
        return fail;
      }, 'n/a')
    }

    return accum;
  }, {});

  const [date, name] = viewRaid === 'nf' ? weekTitle : week.split(':D:').reverse();
  const farmKillLimit = raid === 'sp' ? 600 : 400;
  const sortedCompletions = completedRaids.sort((a, b) => a.totalKills >= farmKillLimit ? -1 : 1);

  return(
    <RaidWeekContainer>
      <RaidWeekHeader raid={raid}>
        <Grid centered>
          {!!name && <div style={{ display: 'flex', alignItems: 'center'}}><br/> {name}</div>}
          <Grid.Column width='8' textAlign='right'>
            <HeaderDate>{date.substring(0, 5)}</HeaderDate>
          </Grid.Column>
          <Grid.Column width='8' verticalAlign='middle'>
            <CharacterCompletions>
              { Object.entries(characterCompletions).map((curr) =>
                <Popup key={curr[0]} trigger={
                  <Icon
                    size="small"
                    name={curr[1] === 'n/a' ? 'circle outline' : 'circle'}
                    color={curr[1] ? curr[1] === 'n/a' ? 'black' : 'green' : 'red'}
                  />
                }
                >
                  {CLASS_MAP[characters[curr[0]].classHash]}
                </Popup>
              )}
            </CharacterCompletions>
          </Grid.Column>
        </Grid>
      </RaidWeekHeader>
      <RaidWeek raid={raid} raids={sortedCompletions} maxCount={Math.abs(maxSuccessRaids)} handleFetchPGCR={handleFetchPGCR} />
      <RaidWeek success={false} raids={failedRaids} maxCount={0} handleFetchPGCR={handleFetchPGCR} />
    </RaidWeekContainer>
  );
};

RaidStack.propTypes = {
  handleFetchPGCR: PropTypes.func.isRequired,
  raidWeek: PropTypes.array.isRequired,
  raid: PropTypes.string.isRequired
};

export default RaidStack;