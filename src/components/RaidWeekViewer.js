import React, { Component } from 'react';
import styled from 'styled-components';
import shortid from 'shortid';

import normalize from '../store/normalize';

const RaidView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const RaidButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-bottom: 10px;
`;

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
  font-size: ${({ raid }) => raid === 'nf' ? '20px' : '26px;'};
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
  width: 60%;
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

const RaidButton = styled.button`
  width: 125px;
  height: 50px;
  margin-right: 5px;
  background-color: ${({ selected }) => selected ? 'black' : 'white'};
  color: ${({ selected }) => selected ? 'white' : 'black'};
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
  const completedRaids = raidValues.filter(raid => raid.values.completed === 1);
  const failedRaids = raidValues.filter(raid => raid.values.completed === 0);

  return(
      <RaidWeekContainer>
        <RaidWeekHeader raid={raid}>{ week }</RaidWeekHeader>
        <RaidWeek>
          { completedRaids && Object.values(completedRaids).map(raid => (
            <RaidStackItems
              onClick={() => handleFetchPGCR(raid.activityDetails.instanceId)}
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
              onClick={() => handleFetchPGCR(raid.activityDetails.instanceId)}
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

class RaidWeekViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      raid: 'lev',
      mode: false,
      raidWeeks: [],
      normalize: false
    }
  }

  componentWillMount = () => {
    //if(!this.state.mode) {
    //  this.setState({ mode: 'prestige'});
    //}
  };

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

  shouldComponentUpdate = (nextProps) => Object.keys(nextProps.raidHistory).length !== 0;

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
    const { raid, mode, raidWeeks } = this.state;
    const { handleFetchPGCR } = this.props;

    const shouldRender = raidWeeks.length > 0;
    return (
      <RaidView>
        { shouldRender && (
          <RaidButtonWrapper>
            <div>
              <RaidButton onClick={() => this.setRaid('eow')} selected={raid==='eow'}>Eater of Worlds</RaidButton>
              <RaidButton onClick={() => this.setRaid('lev')} selected={raid==='lev'}>Leviathan</RaidButton>
              <RaidButton onClick={() => this.setRaid('nf')} selected={raid==='nf'}> Nightfall</RaidButton>
            </div>
            <div style={{ marginTop: 10 }}>
              <RaidButton onClick={() => this.setMode('normal')} selected={mode==='normal'}>Normal</RaidButton>
              <RaidButton onClick={() => this.setMode('prestige')} selected={mode==='prestige'}>Prestige</RaidButton>
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