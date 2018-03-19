import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import shortid from 'shortid';

import normalize from '../store/normalize';

import RaidSelection from './RaidSelection';

const RaidView = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
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
  flex-flow: row wrap;
  justify-content: center;
`;

const RaidStackItems = styled.div`
  display: flex;
  flex-direction: row;
  height: 20px;
  width: 60%;
  ${({ success }) => success ? 'margin-bottom: -1px' : null};
  ${({ success }) => success ? null: 'margin-top: -1px'};
  
  & a {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding-right: 5px;
    height: 100%;
    border-left: 1px solid black;
    border-top: 1px solid black;
    background-color: ${({ success }) => !!success ? 'green' : 'red'};
    width: ${({ activityCount }) => (100 / activityCount)}%;
    text-decoration: none;
  }
  
  .pgcr-link {
    color: white;
    font-size: 14px;
    font-family: san-serif;
  }
`;

const RaidDivs = styled.a`
  width: 150px;
  height: 32px;
  margin-left: 10px;
  margin-right: 5px;
  font-size: 18px;
  font-family: sans-serif;
  color: ${(props) => props.selected ? 'black' : 'blue'};
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

const ScoreView = ({ raid }) => {
  return <p><b>{raid.values.teamScore}</b> {`(${raid.values.score})` }</p>
};

const RaidStack = ({ handleShowStats, handleFetchPGCR, raidWeek, raid }) => {
  const [week, raids] = raidWeek;
  const raidValues = Object.values(raids);

  const completedRaids = raidValues.filter(raid => raid.values.completionReason === 0);
  const failedRaids = raidValues.filter(raid => raid.values.completionReason !== 0);

  const name = week.split('-:-')[0];

  return(
      <RaidWeekContainer>
        <RaidWeekHeader raid={raid}>{ name }</RaidWeekHeader>
        <RaidWeek>
          { completedRaids && Object.values(completedRaids).map(_raid => (
            <RaidStackItems
              onClick={() => handleFetchPGCR(_raid.activityDetails.instanceId)}
              key={shortid.generate()}
              activityCount={1}
              success={true}>
              <Link className="pgcr-link" to={`/destiny/pgcr/${_raid.activityDetails.instanceId}`}>
                { raid === 'nf' && <ScoreView raid={_raid} /> }
              </Link>
            </RaidStackItems>
          ))
          }
        </RaidWeek>
        <RaidWeek fails >
          { failedRaids && Object.values(failedRaids).map(raid => (
            <RaidStackItems
              onClick={() => handleFetchPGCR(raid.activityDetails.instanceId)}
              key={shortid.generate()}
              activityCount={1}>
              <Link className="raidStackItem" to={`/destiny/pgcr/${raid.activityDetails.instanceId}`} />
            </RaidStackItems>
          ))
          }
        </RaidWeek>
      </RaidWeekContainer>
  );
};

class RaidWeekViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false
    }
  }

  normalizeRaidWeeks = (raid, history, mode) => normalize.raidWeeks(raid, history, mode);

  setRaidWeeks = (raidWeeks) => {
    this.setState({ raidWeeks });
  };

  setRaid = (raid) => {
    this.props.setViewRaid(raid);
  };

  setMode = (mode) => {
    this.props.setViewMode(mode);
  };

  //shouldComponentUpdate = (nextProps) => {
  //  //console.log('this.props', this.props);
  //  //console.log('nextProps', nextProps);
  //  const wee = (
  //    this.props.playerProfile.displayName !== nextProps.playerProfile.displayName ||
  //    this.props.raidHistory.raidCount.eow.prestige !== nextProps.raidHistory.raidCount.eow.prestige ||
  //    this.props.raidHistory.raidCount.eow.normal !== nextProps.raidHistory.raidCount.eow.normal ||
  //    this.props.raidHistory.raidCount.lev.prestige !== nextProps.raidHistory.raidCount.lev.prestige ||
  //    this.props.raidHistory.raidCount.lev.normal !== nextProps.raidHistory.raidCount.lev.normal ||
  //    this.props.nightfallHistory.nfCount.prestige !== nextProps.nightfallHistory.nfCount.prestige ||
  //    this.props.nightfallHistory.nfCount.normal !== nextProps.nightfallHistory.nfCount.normal ||
  //    this.props.viewRaid !== nextProps.viewRaid ||
  //    this.props.viewMode !== nextProps.viewMode ||
  //    !!nextProps.playerProfile.notFound
  //  );
  //  console.log('wee', wee);
  //  return wee;
  //};

  render() {
    const { active } = this.state;
    const {
      nightfallHistory, raidHistory, match, history, internalRouting,
      handleDeepLink, handleSetPlayerSearch, handleFetchPGCR, handleClearPGCR,
      playerProfile, playerPrivacy, viewRaid, viewMode
    } = this.props;
//TODO Waggly Dessert is a good example: Somethign wrong with Week 4 and 5, both are A Garden World
    const { notFound, displayName='' } = playerProfile;
    const { nfCount={ prestige: '#', normal: '#' } } = nightfallHistory;
    const { mergedHistory, raidCount={ eow: { prestige: '#', normal: '#' }, lev: { prestige: '#', normal: '#' }} } = raidHistory;

    console.log('this.props', this.props);
    let raidWeeks = [];

    if(viewRaid === 'nf' && !!nightfallHistory[viewMode]) {
      if (Object.keys(nightfallHistory[ viewMode ]).length > 1) {
        raidWeeks = Object.entries(nightfallHistory[viewMode]).map((item) => [ item[ 0 ], item[ 1 ] ])
      }
    } else {
      raidWeeks = this.normalizeRaidWeeks(viewRaid, mergedHistory, viewMode) || [];
    }

    console.log('internalRouting', internalRouting);
    console.log('active', active);
    if(!internalRouting) {
      console.log('internalRouting', internalRouting);
      console.log('internal this.props', this.props);
      handleClearPGCR();
      console.log('playerId', match.params.playerId.toLowerCase());
      console.log('displayName', displayName.toLowerCase());
      console.log('go-n deep', match.params.playerId);

      if(!active || match.params.playerId.toLowerCase() !== displayName.toLowerCase()) {
        handleDeepLink(match.params.playerId);
        handleSetPlayerSearch(match.params.playerId);
        this.setState({ active: true });
      }
    }

    const shouldRender = (raidWeeks.length > 0 && !notFound && !playerPrivacy);

    return (
      <RaidView>
        { playerPrivacy && <h1 style={{ fontSize: 24 }}>The player has set their account to private</h1>}
        { notFound && <h1 style={{ fontSize: 24 }}>Sorry player not found</h1> }
        {shouldRender &&
          <RaidSelection
            handleSetRaid={this.setRaid} handleSetMode={this.setMode}
            nfCount={nfCount} raidCount={raidCount}
            viewRaid={viewRaid} viewMode={viewMode}
          />
        }
        {shouldRender &&
          <RaidStackList>
            {raidWeeks.map(raidWeek => {
              return (
                <RaidStack
                  key={shortid.generate()}
                  handleFetchPGCR={handleFetchPGCR}
                  raidWeek={raidWeek}
                  raid={viewRaid}
                />
              )
            })}
          </RaidStackList>
        }
      </RaidView>
    )
  }
}

export default RaidWeekViewer;