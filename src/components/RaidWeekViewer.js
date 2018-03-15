import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import shortid from 'shortid';

import normalize from '../store/normalize';

const RaidView = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
`;

const RaidButtonWrapper = styled.div`
  display: flex;
  flex: 1 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 10px;
  
  p {
    font-size: 20px;
    margin-right: 10px;
    text-align: right;
  }
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
  
  & > a {
    height: 100%;
    border-left: 1px solid black;
    border-top: 1px solid black;
    background-color: ${({ success }) => !!success ? 'green' : 'red'};
    width: ${({ activityCount }) => (100 / activityCount)}%;
  }
`;

const RaidButton = styled.button`
  width: 125px;
  height: 50px;
  margin-right: 5px;
  border-radius: 5px;
  background-color: ${({ selected }) => selected ? 'black' : 'white'};
  color: ${({ selected }) => selected ? 'white' : 'black'};
`;

const RaidDivs = styled.div`
  width: 150px;
  height: 32px;
  margin-right: 5px;
  p {
    font-size: 18px;
    color: ${(props) => props.selected ? 'black' : 'blue'};
    
    &:hover {
      color: purple;
      text-decoration: underline;
    }
  }
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
          { completedRaids && Object.values(completedRaids).map(raid => (
            <RaidStackItems
              onClick={() => handleFetchPGCR(raid.activityDetails.instanceId)}
              key={shortid.generate()}
              activityCount={1}
              success={true}>
              <Link className="raidStackItem" to={`/destiny/pgcr/${raid.activityDetails.instanceId}`} />
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
      raid: 'lev',
      mode: false,
      deepLink: false,
      raidWeeks: [],
      normalize: false
    }
  }

  componentDidUpdate = () => {
    const { raid, mode, normalize } = this.state;
    const { raidHistory, nightfallHistory } = this.props;
    const { mergedHistory } = raidHistory;

    const raidWeeks = raid === 'nf'
      ? Object.entries(nightfallHistory[mode]).map((item) => [item[0], item[1]])
      : this.normalizeRaidWeeks(raid, mergedHistory, mode);

    if(normalize) {
      this.setState({
        raidWeeks,
        normalize: false
      })
    }
  };

  normalizeRaidWeeks = (raid, history, mode) => normalize.raidWeeks(raid, history, mode);

  setRaidWeeks = (raidWeeks) => {
    this.setState({
      raidWeeks,
      normalize
    });
  };

  setRaid = (raid) => {
    this.setState({
      raid,
      normalize: true
    })
  };

  setMode = (mode) => {
    this.setState({
      mode,
      normalize: true
    })
  };

  toggleNormalized = () => {
    this.setState({
      normalize: !this.state.normalize,
    })
  };

  setUp = () => {
    this.setState({
      normalize: true,
      mode: 'prestige'
    })
  };

  toggleDeepLink = () => {
    this.setState({ deepLink: !this.state.deepLink })
  };

  shouldComponentUpdate = (nextProps) => {
    return (
      Object.keys(nextProps.raidHistory).length !== 0 ||
      Object.keys(nextProps.nightfallHistory).length !== 0 ||
      nextProps.playerProfile.notFound &&
      nextProps.match.isExact
    );
  };

  componentWillReceiveProps = (nextProps) => {
    const { mode } = this.props;
    if(!mode) {
      this.setUp();
    }
    else if(mode !== nextProps.mode) {
      this.toggleNormalized();
    }
  };

  render() {
    const { raid, mode, raidWeeks, deepLink } = this.state;
    const {
      nightfallHistory, raidHistory, match, internalRouting,
      handleDeepLink, searchPlayer, handleFetchPGCR, handleClearPGCR,
      playerProfile: { notFound }, playerPrivacy
    } = this.props;

    const { nfCount={ prestige: '#', normal: '#' } } = nightfallHistory;
    const { raidCount={ eow: { prestige: '#', normal: '#' }, lev: { prestige: '#', normal: '#' }} } = raidHistory;


    if(match.isExact && !internalRouting && !deepLink) {
      handleClearPGCR();
      handleDeepLink(match.params.playerId, searchPlayer);
      this.toggleDeepLink();
    }

    const shouldRender = (!notFound && !playerPrivacy);

    return (
      <RaidView>
        { playerPrivacy && <h1 style={{ fontSize: 24 }}>The player has set their account to private</h1>}
        { notFound && <h1 style={{ fontSize: 24 }}>Sorry player not found</h1> }
        { shouldRender && (
          <RaidButtonWrapper>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <p>EOW:</p>
              <RaidDivs
                selected={raid==='eow' && mode ==='normal'}
                onClick={() => { this.setRaid('eow'); this.setMode('normal');}}>
                <p>Normal({raidCount.eow.normal})</p>
              </RaidDivs>
              <RaidDivs
                selected={raid==='eow' && mode ==='prestige'}
                onClick={() => { this.setRaid('eow'); this.setMode('prestige');}}>
                <p>Prestige({raidCount.eow.prestige})</p>
              </RaidDivs><br />
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <p>Leviathan:</p>
              <RaidDivs
                selected={raid==='lev' && mode ==='normal'}
                onClick={() => { this.setRaid('lev'); this.setMode('normal');}}>
                <p>Normal({raidCount.lev.normal})</p>
              </RaidDivs>
              <RaidDivs
                selected={raid==='lev' && mode ==='prestige'}
                onClick={() => { this.setRaid('lev'); this.setMode('prestige');}}>
                <p>Prestige({raidCount.lev.prestige})</p>
              </RaidDivs>
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <p>Nightfall:</p>
              <RaidDivs
                selected={raid==='nf' && mode ==='normal'}
                onClick={() => { this.setRaid('nf'); this.setMode('normal');}}>
                <p>Normal({nfCount.normal})</p>
              </RaidDivs>
              <RaidDivs
                selected={raid==='nf' && mode ==='prestige'}
                onClick={() => { this.setRaid('nf'); this.setMode('prestige');}}>
                <p>Prestige({nfCount.prestige})</p>
              </RaidDivs><br />
            </div>
          </RaidButtonWrapper>
        )}
      { shouldRender && (
          <RaidStackList>
            { raidWeeks.map(raidWeek => {
              return (
                <RaidStack
                  key={shortid.generate()}
                  handleFetchPGCR={handleFetchPGCR}
                  raidWeek={raidWeek}
                  raid={raid}
                />
              )
            })
            }
          </RaidStackList>
      )}
      </RaidView>
    )
  }
}

export default RaidWeekViewer;