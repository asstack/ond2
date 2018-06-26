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
  display: flex;
  align-items: baseline;
  margin-bottom: 10px;
  ${({ selected }) => selected ? '' : 'border-bottom: 1px solid #2b76ed' };
  
`;

const ActivityCount = styled.p`
  margin-right: 5px;
  font-family: Montserrat;
  font-size: 24px;
  font-weight: ${({ selected }) => selected ? 600 : 'normal'};
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  vertical-align: text-bottom;
  color: ${({ selected }) => selected ? 'black' : '#2b76ed'};
  cursor: ${({ selected }) => selected ? 'default' : 'pointer' };
  
  @media only screen and (max-width: 400px) {
    font-size: 12px;
  }
`;

const TotalCount = ActivityCount.extend`
  font-size: 16px;
  
  @media only screen and (max-width: 400px) {
    font-size: 8px;
  }
`;

const RaidSelection = ({ handleSetRaid, handleSetMode, nfCount, raidCount, activityType, viewRaid, viewMode }) => {
  return (
    <Grid style={{ border: '1px solid #BEBEBE', borderBottom: 'none' }} className="raid-selection" centered columns={3}>
      <Grid.Column>
        <RaidSelect noLeftBorder={viewRaid === 'spire'} noRightBorder={viewRaid !== 'spire'} selected={viewRaid === 'spire'}>
          <RaidHeading selected={viewRaid === 'spire'} onClick={() => { handleSetRaid('spire'); handleSetMode('normal');}}>
            <p>SOS</p>
          </RaidHeading>
          <SelectionGroup oneSelection selected={viewRaid === 'spire'}>
            <Selection
              href="javascript:void(0)"
              selected={viewRaid==='spire' && viewMode ==='normal'}
              onClick={() => { handleSetRaid('spire'); handleSetMode('normal');}}
            >
              <ActivityCount selected={viewRaid==='spire' && viewMode ==='normal'}>
                N{raidCount.spire.successCount.normal - raidCount.spire.farmCount.normal}
              </ActivityCount>
              <TotalCount selected={viewRaid==='spire' && viewMode ==='normal'}>{raidCount.spire.successCount.normal}</TotalCount>
            </Selection>
          </SelectionGroup>
        </RaidSelect>
      </Grid.Column>

      <Grid.Column>
        <RaidSelect noRightBorder={viewRaid !== 'eow'} noLeftBorder={viewRaid !== 'eow'} selected={viewRaid ==='eow'}>
          <RaidHeading selected={viewRaid === 'eow'} onClick={() => { handleSetRaid('eow'); handleSetMode('normal');}}>
            <p>EOW</p>
          </RaidHeading>
          <SelectionGroup oneSelection selected={viewRaid === 'eow'}>
            <Selection
              href="javascript:void(0)"
              selected={viewRaid==='eow' && viewMode ==='normal'}
              onClick={() => { handleSetRaid('eow'); handleSetMode('normal');}}
            >
              <ActivityCount selected={viewRaid==='eow' && viewMode ==='normal'}>
                N{raidCount.eow.successCount - raidCount.eow.farmCount}
              </ActivityCount>
              <TotalCount selected={viewRaid==='eow' && viewMode ==='normal'}>{raidCount.eow.successCount}</TotalCount>
            </Selection>
          </SelectionGroup>
        </RaidSelect>
      </Grid.Column>

      <Grid.Column>
        <RaidSelect noLeftBorder={viewRaid !== 'lev'} selected={viewRaid ==='lev'}>
          <RaidHeading selected={viewRaid === 'lev'} onClick={() => { handleSetRaid('lev'); handleSetMode('prestige');}}>
            <p>Leviathan</p>
          </RaidHeading>
          <SelectionGroup selected={viewRaid === 'lev'}>
            <Selection
              href="javascript:void(0)"
              selected={viewRaid==='lev' && viewMode ==='normal'}
              onClick={() => { handleSetRaid('lev'); handleSetMode('normal');}}
            >
              <ActivityCount selected={viewRaid==='lev' && viewMode ==='normal'}>
                N{raidCount.lev.successCount.normal - raidCount.lev.farmCount.normal}
              </ActivityCount>
              <TotalCount selected={viewRaid==='lev' && viewMode ==='normal'}>{raidCount.lev.successCount.normal}</TotalCount>
            </Selection>
            <Selection
              href="javascript:void(0)"
              selected={viewRaid==='lev' && viewMode ==='prestige'}
              onClick={() => { handleSetRaid('lev'); handleSetMode('prestige');}}
            >
              <ActivityCount selected={viewRaid==='lev' && viewMode ==='prestige'}>
                P{raidCount.lev.successCount.prestige - raidCount.lev.farmCount.prestige}
              </ActivityCount>
              <TotalCount selected={viewRaid==='lev' && viewMode ==='prestige'}>{raidCount.lev.successCount.prestige}</TotalCount>
            </Selection>
          </SelectionGroup>
        </RaidSelect>
      </Grid.Column>
    </Grid>
  );
};

export default RaidSelection;

/*
 <Selection
              href="javascript:void(0)"
              selected={viewRaid==='spire' && viewMode ==='prestige'}
              onClick={() => { handleSetRaid('spire'); handleSetMode('prestige');}}
            >
              <ActivityCount selected={viewRaid==='spire' && viewMode ==='prestige'}>
                P{raidCount.spire.successCount.prestige}
              </ActivityCount>
              <FarmCount selected={viewRaid==='spire' && viewMode ==='prestige'}>{raidCount.spire.farmCount.prestige}</FarmCount>
            </Selection>
 */