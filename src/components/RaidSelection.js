import React from 'react';
import styled from 'styled-components';

const RaidViewSelectionWrapper = styled.div`
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

const RaidSelect = styled.div`
  display: flex;
  flexDirection: row;
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


const RaidSelection = ({ handleSetRaid, handleSetMode, nfCount, raidCount, viewRaid, viewMode }) => {
  console.log('viewMode', viewMode);
  console.log('viewRiad', viewRaid);
  return (<RaidViewSelectionWrapper>
    <RaidSelect> EOW:
      <RaidDivs
        href="javascript:void(0)"
        selected={viewRaid==='eow' && viewMode ==='normal'}
        onClick={() => { handleSetRaid('eow'); handleSetMode('normal');}}
      >
        Normal({raidCount.eow.normal})
      </RaidDivs>
      <RaidDivs
        href="javascript:void(0)"
        selected={viewRaid==='eow' && viewMode ==='prestige'}
        onClick={() => { handleSetRaid('eow'); handleSetMode('prestige');}}
      >
        Prestige({raidCount.eow.prestige})
      </RaidDivs>
    </RaidSelect>

    <RaidSelect> Leviathan:
      <RaidDivs
        href="javascript:void(0)"
        selected={viewRaid==='lev' && viewMode ==='normal'}
        onClick={() => { handleSetRaid('lev'); handleSetMode('normal');}}
      >
        Normal({raidCount.lev.normal})
      </RaidDivs>
      <RaidDivs
        href="javascript:void(0)"
        selected={viewRaid==='lev' && viewMode ==='prestige'}
        onClick={() => { handleSetRaid('lev'); handleSetMode('prestige');}}
      >
        Prestige({raidCount.lev.prestige})
      </RaidDivs>
    </RaidSelect>

    <RaidSelect> Nightfall:
      <RaidDivs
        href="javascript:void(0)"
        selected={viewRaid==='nf' && viewMode ==='normal'}
        onClick={() => { handleSetRaid('nf'); handleSetMode('normal');}}
      >
        Normal({nfCount.normal})
      </RaidDivs>
      <RaidDivs
        href="javascript:void(0)"
        selected={viewRaid==='nf' && viewMode ==='prestige'}
        onClick={() => { handleSetRaid('nf'); handleSetMode('prestige');}}>
        Prestige({nfCount.prestige})
      </RaidDivs>
    </RaidSelect>
  </RaidViewSelectionWrapper>
);
};

export default RaidSelection;