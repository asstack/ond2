import React from 'react';
import styled from 'styled-components';
import { Grid } from 'semantic-ui-react';

const SelectionGroup = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: ${({ oneSelection }) => oneSelection ? 'flex-start' : 'space-evenly' };
  padding-left: ${({ oneSelection }) => oneSelection ? '20px' : '0px' };
  background-color: ${props => props.selected ? 'white' : '#eeeeee' };
`;

const RaidHeading = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  background-color: ${props => props.selected ? 'white' : '#eeeeee'};
  justify-content: center;
  padding-bottom: 5px;
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

//  background-color: ${props => props.selected ? 'white' : '#eeeeee'};
const RaidSelect = styled.div`
  width: 100%;
  align-items: center;
  padding-top: 15px;
  background-color: white;
  border-bottom: none;
  ${({ noRightBorder }) => noRightBorder ? 'border-right: none' : ''};
  ${({ noLeftBorder }) => noLeftBorder ? 'border-left: none' : ''};
`;

const Selection = styled.div`
  padding-bottom: 10px;
    
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
    <Grid style={{ border: '1px solid #BEBEBE' }} className="raid-selection" centered columns={2}>
      <Grid.Column>
        <RaidSelect noRightBorder={viewRaid  !== 'nf'} selected={viewRaid ==='nf'}>
          <RaidHeading selected={viewRaid ==='nf'} onClick={() => { handleSetRaid('nf'); handleSetMode('prestige');}}>
            <p>Nightfall</p>
          </RaidHeading>
          <SelectionGroup selected={viewRaid ==='nf'}>
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
          <RaidHeading selected={viewRaid ==='ep'} onClick={() => { handleSetRaid('ep'); handleSetMode('normal');}}>
            <p>Escalation Protocol</p>
          </RaidHeading>
          <SelectionGroup oneSelection selected={viewRaid ==='ep'}>
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