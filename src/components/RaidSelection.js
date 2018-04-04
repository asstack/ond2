import React from 'react';
import styled from 'styled-components';

const RaidViewSelectionWrapper = styled.div`
  display: flex;
  flex 1 100%;
  max-width: 1100px;
  justify-content: space-around;
  align-items: center;
  flex-direction: row;
  
  p {
    font-size: 20px;
    margin-right: 10px;
    text-align: right;
  }
  
  @media only screen and (max-width: 400px) {
    width: 300px;
    
    p {
      font-size: 14px;
    }
  }
  
  @media only screen and (min-width: 400px) and (max-width: 750px) {
    width: 375px;
  }
  
  @media only screen and (min-width: 750px) and (max-width: 1100px) {
    max-width: 500px;
  
  }
`;

const SelectionGroup = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  
  @media only screen and (max-width: 750px) {
    width: 92%;
  }
  
  @media only screen and (min-width: 750px) and (max-width: 1100px) {
  
  }
`;

const RaidHeading = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 15px;
  font-family: Montserrat;
  font-size: 20px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #000000;
`;

const RaidSelect = styled.div`
  width: 360px;
  height: 88px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  border-radius: 4px;
  background-color: ${props => props.selected ? 'white' : '#eeeeee'};
  
  @media only screen and (min-width: 400px) and (max-width: 750px) {
    width: 125px;
  }
  
  @media only screen and (min-width: 750px) and (max-width: 1100px) {
    width: 160px;
   
  }
`;

const Selection = styled.div`
  margin-bottom: 15px;
  
  p {
    font-family: Montserrat;
    font-size: 16px;
    font-weight: ${({ selected }) => selected ? 600 : 'normal'};
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: ${({ selected }) => selected ? 'black' : '#2b76ed'};
    cursor: ${({ selected }) => selected ? 'default' : 'pointer' };
    text-decoration: ${({ selected }) => selected ? 'none' : 'underline' };
  }
`;

const RaidSelection = ({ handleSetRaid, handleSetMode, nfCount, raidCount, viewRaid, viewMode }) => {
  return (
    <RaidViewSelectionWrapper>
      <RaidSelect selected={viewRaid==='eow'}>
        <RaidHeading onClick={() => { handleSetRaid('eow'); handleSetMode('normal');}}>
          <p>EOW</p>
        </RaidHeading>
        <SelectionGroup>
          <Selection
            href="javascript:void(0)"
            selected={viewRaid==='eow' && viewMode ==='normal'}
            onClick={() => { handleSetRaid('eow'); handleSetMode('normal');}}
          >
            <p>N {raidCount.eow.normal}</p>
          </Selection>
        </SelectionGroup>
      </RaidSelect>

      <RaidSelect selected={viewRaid==='lev'}>
        <RaidHeading onClick={() => { handleSetRaid('lev'); handleSetMode('prestige');}}>
          <p>Leviathan</p>
        </RaidHeading>
        <SelectionGroup>
          <Selection
            href="javascript:void(0)"
            selected={viewRaid==='lev' && viewMode ==='normal'}
            onClick={() => { handleSetRaid('lev'); handleSetMode('normal');}}
          >
            <p>N {raidCount.lev.normal}</p>
          </Selection>
          <Selection
            href="javascript:void(0)"
            selected={viewRaid==='lev' && viewMode ==='prestige'}
            onClick={() => { handleSetRaid('lev'); handleSetMode('prestige');}}
          >
            <p>P {raidCount.lev.prestige}</p>
          </Selection>
        </SelectionGroup>
      </RaidSelect>

      <RaidSelect selected={viewRaid ==='nf'}>
        <RaidHeading onClick={() => { handleSetRaid('nf'); handleSetMode('prestige');}}>
          <p>Nightfall</p>
        </RaidHeading>
        <SelectionGroup>
          <Selection
            href="javascript:void(0)"
            selected={viewRaid==='nf' && viewMode ==='normal'}
            onClick={() => { handleSetRaid('nf'); handleSetMode('normal');}}
          >
            <p>N {nfCount.normal}</p>
          </Selection>
          <Selection
            href="javascript:void(0)"
            selected={viewRaid==='nf' && viewMode ==='prestige'}
            onClick={() => { handleSetRaid('nf'); handleSetMode('prestige');}}>
            <p>P {nfCount.prestige}</p>
          </Selection>
        </SelectionGroup>
      </RaidSelect>
    </RaidViewSelectionWrapper>
);
};

export default RaidSelection;