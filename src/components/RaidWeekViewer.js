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
    font-family: sans-serif;
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

const ScoreView = ({ raid }) => {
  return <p>{ `${raid.values.score} / ${raid.values.teamScore}` }</p>
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
      deepLink: false,
      raidWeeks: [],
      normalize: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { viewRaid, viewMode, raidHistory, nightfallHistory } = this.props;
    const { mergedHistory } = raidHistory;

    const prepareNewData = (
      prevState.raidWeeks.length === 0 ||
      prevProps.viewRaid !== viewRaid ||
      prevProps.viewMode !== viewMode
    );

    if(prepareNewData) {
      const historyReady = (Object.keys(nightfallHistory).length > 0 && Object.keys(raidHistory).length > 0);

      if(historyReady) {}
          const raidWeeks = viewRaid === 'nf'
            ? Object.entries(nightfallHistory[viewMode]).map((item) => [item[0], item[1]])
            : this.normalizeRaidWeeks(viewRaid, mergedHistory, viewMode);

          this.setState({ raidWeeks })
      }
  }

  normalizeRaidWeeks = (raid, history, mode) => normalize.raidWeeks(raid, history, mode);

  setRaidWeeks = (raidWeeks) => {
    this.setState({
      raidWeeks,
      normalize
    });
  };

  setRaid = (raid) => {
    this.props.setViewRaid(raid);
    this.setState({ normalize: true });
  };

  setMode = (mode) => {
    this.props.setViewMode(mode);
    this.setState({ normalize: true });
  };

  toggleNormalized = () => {
    this.setState({ normalize: !this.state.normalize });
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

  shouldComponentUpdate = (nextProps) => (
      Object.keys(nextProps.raidHistory).length !== 0 ||
      Object.keys(nextProps.nightfallHistory).length !== 0 ||
      this.props.viewRaid !== nextProps.viewRaid ||
      this.props.viewMode !== nextProps.viewMode ||
      !!nextProps.playerProfile.notFound &&
      nextProps.match.isExact
    );

  componentWillReceiveProps = (nextProps) => {
    const { viewRaid } = this.props;
    if(viewRaid !== nextProps.viewRaid) {
      if(nextProps.viewRaid !== 'nf') {
        this.toggleNormalized();
      }
    }
  };

  render() {
    const { raidWeeks, deepLink } = this.state;
    const {
      nightfallHistory, raidHistory, match, internalRouting,
      handleDeepLink, handleFetchPGCR, handleClearPGCR,
      playerProfile: { notFound=false }, playerPrivacy, viewRaid, viewMode
    } = this.props;

    const { nfCount={ prestige: '#', normal: '#' } } = nightfallHistory;
    const { raidCount={ eow: { prestige: '#', normal: '#' }, lev: { prestige: '#', normal: '#' }} } = raidHistory;

    if(deepLink) {
      this.toggleDeepLink();
    }
    else {
      if(!internalRouting && !deepLink) {
        handleClearPGCR();
        handleDeepLink(match.params.playerId, true);
      }
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
                selected={viewRaid==='eow' && viewMode ==='normal'}
                onClick={() => { this.setRaid('eow'); this.setMode('normal');}}>
                <p>Normal({raidCount.eow.normal})</p>
              </RaidDivs>
              <RaidDivs
                selected={viewRaid==='eow' && viewMode ==='prestige'}
                onClick={() => { this.setRaid('eow'); this.setMode('prestige');}}>
                <p>Prestige({raidCount.eow.prestige})</p>
              </RaidDivs><br />
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <p>Leviathan:</p>
              <RaidDivs
                selected={viewRaid==='lev' && viewMode ==='normal'}
                onClick={() => { this.setRaid('lev'); this.setMode('normal');}}>
                <p>Normal({raidCount.lev.normal})</p>
              </RaidDivs>
              <RaidDivs
                selected={viewRaid==='lev' && viewMode ==='prestige'}
                onClick={() => { this.setRaid('lev'); this.setMode('prestige');}}>
                <p>Prestige({raidCount.lev.prestige})</p>
              </RaidDivs>
            </div>
            <div style={{display: 'flex', flexDirection: 'row'}}>
              <p>Nightfall:</p>
              <RaidDivs
                selected={viewRaid==='nf' && viewMode ==='normal'}
                onClick={() => { this.setRaid('nf'); this.setMode('normal');}}>
                <p>Normal({nfCount.normal})</p>
              </RaidDivs>
              <RaidDivs
                selected={viewRaid==='nf' && viewMode ==='prestige'}
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
                  raid={viewRaid}
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