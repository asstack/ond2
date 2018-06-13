import React from 'react';
import styled from 'styled-components';
import { Grid } from 'semantic-ui-react';

const SelectionGroup = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ oneSelection }) => oneSelection ? 'flex-start' : 'space-evenly' };
  margin-left: ${({ oneSelection }) => oneSelection ? '20px' : '0px' };;
`;

const RaidHeading = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: center;
  margin-bottom: 5px;
  font-family: Montserrat;
  font-size: 20px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #000000;
  
  @media only screen and (max-width: 767px) {
    text-align: center;
    font-size: 14px;
  }
`;

const RaidSelect = styled.div`
  width: 100%;
  align-items: center;
  padding-top: 20px;
  background-color: ${props => props.selected ? 'white' : '#eeeeee'};
  ${props => props.selected ? 'border: 1px solid #BEBEBE' : '' };
  border-bottom: none;
  ${({ noRightBorder }) => noRightBorder ? 'border-right: none' : ''};
  ${({ noLeftBorder }) => noLeftBorder ? 'border-left: none' : ''};
`;

const Selection = styled.div`
  margin-bottom: 10px;
  
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

const ActivitiesSelection = ({ handleSetRaid, handleSetMode, nfSuccessCount, raidCount, epSuccessCount, activityType, viewRaid, viewMode }) => {

  return (
    <Grid className="raid-selection" centered columns={2}>
      <Grid.Column>
        <RaidSelect noRightBorder={viewRaid  !== 'nf'} selected={viewRaid ==='nf'}>
          <RaidHeading onClick={() => { handleSetRaid('nf'); handleSetMode('prestige');}}>
            <p>Nightfall</p>
          </RaidHeading>
          <SelectionGroup>
            <Selection
              href="javascript:void(0)"
              selected={viewRaid==='nf' && viewMode ==='normal'}
              onClick={() => { handleSetRaid('nf'); handleSetMode('normal');}}
            >
              <p>N {nfSuccessCount.normal}</p>
            </Selection>
            <Selection
              href="javascript:void(0)"
              selected={viewRaid==='nf' && viewMode ==='prestige'}
              onClick={() => { handleSetRaid('nf'); handleSetMode('prestige');}}>
              <p>P {nfSuccessCount.prestige}</p>
            </Selection>
          </SelectionGroup>
        </RaidSelect>
      </Grid.Column>
      <Grid.Column>
        <RaidSelect noLeftBorder={viewRaid !== 'ep'} selected={viewRaid ==='ep'}>
          <RaidHeading onClick={() => { handleSetRaid('ep'); handleSetMode('normal');}}>
            <p>Escalation Protocol</p>
          </RaidHeading>
          <SelectionGroup oneSelection>
            <Selection
              href="javascript:void(0)"
              selected={viewRaid==='ep' && viewMode ==='normal'}
              onClick={() => { handleSetRaid('ep'); handleSetMode('normal');}}
            >
              <p>N {epSuccessCount}</p>
            </Selection>
          </SelectionGroup>
        </RaidSelect>
      </Grid.Column>
    </Grid>
  );
};

export default ActivitiesSelection;