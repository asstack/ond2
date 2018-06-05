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

const ActivitiesSelection = ({ handleSetRaid, handleSetMode, nfCount, raidCount, epCount={normal: 0, prestige: 0}, viewRaid, viewMode }) => {

  console.log('viewRaid', viewRaid);
  console.log('viewMode', viewMode);
  return (
    <Grid className="raid-selection" centered columns={2}>
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
      <Grid.Column>
        <RaidSelect selected={viewRaid ==='ep'}>
          <RaidHeading onClick={() => { handleSetRaid('ep'); handleSetMode('prestige');}}>
            <p>Escalation Protocol</p>
          </RaidHeading>
          <SelectionGroup>
            <Selection
              href="javascript:void(0)"
              selected={viewRaid==='nf' && viewMode ==='normal'}
              onClick={() => { handleSetRaid('ep'); handleSetMode('normal');}}
            >
              <p>N {epCount.normal}</p>
            </Selection>
            <Selection
              href="javascript:void(0)"
              selected={viewRaid==='nf' && viewMode ==='prestige'}
              onClick={() => { handleSetRaid('ep'); handleSetMode('prestige');}}>
              <p>P {epCount.prestige}</p>
            </Selection>
          </SelectionGroup>
        </RaidSelect>
      </Grid.Column>
    </Grid>
  );
};

export default ActivitiesSelection;