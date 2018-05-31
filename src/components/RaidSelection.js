import React from 'react';
import styled from 'styled-components';
import { Grid } from 'semantic-ui-react';

const SelectionGroup = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
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
  
  @media only screen and  (max-width: 574px) {
    text-align: center;
    font-size: 14px;
  }
`;

const RaidSelect = styled.div`
  width: 100%;
  height: 88px;
  align-items: center;
  padding-top: 20px;
  border-radius: 4px;
  background-color: ${props => props.selected ? 'white' : '#eeeeee'};
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
  console.log('raidCount', raidCount);
  return (
    <Grid className="raid-selection" centered columns={4}>
      <Grid.Column>
        <RaidSelect selected={viewRaid==='spire'}>
          <RaidHeading onClick={() => { handleSetRaid('spire'); handleSetMode('prestige');}}>
            <p>Spire of Stars</p>
          </RaidHeading>
          <SelectionGroup>
            <Selection
              href="javascript:void(0)"
              selected={viewRaid==='spire' && viewMode ==='normal'}
              onClick={() => { handleSetRaid('spire'); handleSetMode('normal');}}
            >
              <p>N {raidCount.spire.normal}</p>
            </Selection>
            <Selection
              href="javascript:void(0)"
              selected={viewRaid==='spire' && viewMode ==='prestige'}
              onClick={() => { handleSetRaid('spire'); handleSetMode('prestige');}}
            >
              <p>P {raidCount.spire.prestige}</p>
            </Selection>
          </SelectionGroup>
        </RaidSelect>
      </Grid.Column>

      <Grid.Column>
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
      </Grid.Column>

      <Grid.Column>
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
      </Grid.Column>

      <Grid.Column>
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
      </Grid.Column>
    </Grid>
  );
};

export default RaidSelection;