import React from 'react';
import styled from 'styled-components';

const RaidViewSelectionWrapper = styled.div`
  display: flex;
  max-width: 1000px;
  flex: 1 100%;
  justify-content: space-evenly;
  align-items: center;
  flex-direction: row;
  
  p {
    font-size: 20px;
    margin-right: 10px;
    text-align: right;
  }
`;

const SelectionGroup = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

const RaidHeading = styled.div`
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 8px;
`;

const RaidSelect = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 15px;
  border-radius: 2px;
  background-color: ${props => props.selected ? 'skyblue' : 'white'};
`;

const Selection = styled.a`
  width: 75px;
  height: 32px;
  font-size: 18px;
  font-family: sans-serif;
  color: ${(props) => props.selected ? 'black' : 'blue'};
  ${props => props.selected && 'text-decoration: none'};
  ${props => props.selected && 'cursor: default'};
  
  :nth-child(2) {
    margin-left: 30px;
  }
`;

const RaidSelection = ({ handleSetRaid, handleSetMode, nfCount, raidCount, viewRaid, viewMode }) => {
  return (
    <RaidViewSelectionWrapper>
      <RaidSelect selected={viewRaid==='eow'}>
        <RaidHeading onClick={() => { handleSetRaid('eow'); handleSetMode('normal');}}>
          EOW
        </RaidHeading>
        <SelectionGroup>
          <Selection
            href="javascript:void(0)"
            selected={viewRaid==='eow' && viewMode ==='normal'}
            onClick={() => { handleSetRaid('eow'); handleSetMode('normal');}}
          >
            Normal({raidCount.eow.normal})
          </Selection>
        </SelectionGroup>
      </RaidSelect>

      <RaidSelect selected={viewRaid==='lev'}>
        <RaidHeading onClick={() => { handleSetRaid('lev'); handleSetMode('normal');}}>
          Leviathan
        </RaidHeading>
        <SelectionGroup>
          <Selection
            href="javascript:void(0)"
            selected={viewRaid==='lev' && viewMode ==='normal'}
            onClick={() => { handleSetRaid('lev'); handleSetMode('normal');}}
          >
            Normal({raidCount.lev.normal})
          </Selection>
          <Selection
            href="javascript:void(0)"
            selected={viewRaid==='lev' && viewMode ==='prestige'}
            onClick={() => { handleSetRaid('lev'); handleSetMode('prestige');}}
          >
            Prestige({raidCount.lev.prestige})
          </Selection>
        </SelectionGroup>
      </RaidSelect>

      <RaidSelect selected={viewRaid ==='nf'}>
        <RaidHeading onClick={() => { handleSetRaid('nf'); handleSetMode('prestige');}}>
          Nightfall
        </RaidHeading>
        <SelectionGroup>
          <Selection
            href="javascript:void(0)"
            selected={viewRaid==='nf' && viewMode ==='normal'}
            onClick={() => { handleSetRaid('nf'); handleSetMode('normal');}}
          >
            Normal({nfCount.normal})
          </Selection>
          <Selection
            href="javascript:void(0)"
            selected={viewRaid==='nf' && viewMode ==='prestige'}
            onClick={() => { handleSetRaid('nf'); handleSetMode('prestige');}}>
            Prestige({nfCount.prestige})
          </Selection>
        </SelectionGroup>
      </RaidSelect>
    </RaidViewSelectionWrapper>
);
};

export default RaidSelection;