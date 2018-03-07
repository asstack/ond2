import React, { Component } from 'react';
import styled from 'styled-components';
import shortid from 'shortid';

const RAID_HASHES = {
  eow: {
    prestige: [ 417231112, 757116822, 1685065161, 2449714930, 3446541099, 3879860661 ],
    normal: [ 417231112, 757116822, 1685065161, 2449714930, 3446541099, 3879860661 ]
  },
  lev: {
    prestige: [ 809170886 ],
    normal: [ 3089205900 ]
  }
};

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
  font-size: 26px;
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
  width: 100%;
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

const RaidStack = ({ handleShowStats, handleFetchPGCR, raidWeek }) => {
  const [week, raids] = raidWeek;
  const raidValues = Object.values(raids);
  const completedRaids = raidValues.filter(raid => raid.values.completed);
  const failedRaids = raidValues.filter(raid => !raid.values.completed);

  return(
      <RaidWeekContainer>
        <RaidWeekHeader>{ week }</RaidWeekHeader>
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

const determineRaidWeeks = (raid, history, mode) => {
  const slicedRaid = (
    raid === 'EATER_OF_WORLDS'
      ? Object.entries(history.EOW).reverse().slice(0, 5).reverse()
      : Object.entries(history.LEV).reverse().slice(0, 5).reverse()
  );

  console.log('mode', mode);
  console.log('slicedArray', slicedRaid);
  console.log('raidHash', RAID_HASHES[raid]);

  return mode === 'both' ?
    slicedRaid
    : mode === 'prestige' ?
      slicedRaid.map(curr =>
        [
          curr[0],
          Object.entries(curr[1])
            .filter(data => RAID_HASHES[raid].prestige.indexOf(data.activityDetails.referenceId) >= 0)
        ])
      :slicedRaid.map(curr =>
        [
          curr[0],
          Object.values(curr[1])
            .filter(data => {
              console.log('checkzzz', RAID_HASHES[raid].normal.indexOf(data.activityDetails.referenceId) >= 0);
              return RAID_HASHES[raid].normal.indexOf(data.activityDetails.referenceId) >= 0
            })
        ])
};

class RaidWeekViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      raid: 'eow',
      mode: false,
      raidWeeks: []
    }
  }

  componentDidMount() {
    !this.state.mode && this.setMode('both');
  }

  setRaid = (raid) => {
    this.setState({
      raid
    })
  };

  setMode = (mode) => {
    console.log('mode', mode);
    console.log('state', this.state);
    console.log('props', this.props);
    console.log('check', this.state.mode === mode);
    // if(this.state.mode === mode) return;

    console.log('after');
    const { raid } = this.state;
    const { mergedHistory = {EOW: false, LEV: false}} = this.props;

    console.log('mergedHistory', mergedHistory);
    const newRaidWeeks = determineRaidWeeks(raid, mergedHistory, mode);
    console.log('newRaidWeeks', newRaidWeeks);
    this.setState({
      mode,
      raidWeeks: newRaidWeeks
    })
  };

  render() {
    const { raid, mode, raidWeeks } = this.state;
    const {
      raidHistory : { mergedHistory = {EOW: false, LEV: false} },
      handleFetchPGCR
    } = this.props;

    console.log('mode', mode);
    console.log('raidWeeks', raidWeeks);
    return (
      <RaidView>
        <RaidButtonWrapper>
          <div>
            <RaidButton onClick={() => this.setRaid('eow')} selected={raid==='eow'}>Eater of Worlds</RaidButton>
            <RaidButton onClick={() => this.setRaid('lev')} selected={raid==='lev'}>Leviathan</RaidButton>
          </div>
          <div style={{ marginTop: 10 }}>
            <RaidButton onClick={() => this.setMode('normal')} selected={mode==='normal'}>Normal</RaidButton>
            <RaidButton onClick={() => this.setMode('both')} selected={mode==='both'}>Both</RaidButton>
            <RaidButton onClick={() => this.setMode('prestige')} selected={mode==='prestige'}>Prestige</RaidButton>
          </div>
        </RaidButtonWrapper>

      { raidWeeks && (
          <RaidStackList>
            { raidWeeks.map(raidWeek => {
              return (
                <RaidStack
                  key={shortid.generate()}
                  handleFetchPGCR={handleFetchPGCR}
                  raidWeek={raidWeek}
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