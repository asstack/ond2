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
  
  @media only screen and  (max-width: 767px) {
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
  display: flex;
  justify-content: space-around;
  align-items: baseline;
`;

const ActivityCount = styled.p`
  margin-right: 5px;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: ${({ selected }) => selected ? 600 : 'normal'};
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  vertical-align: text-bottom;
  color: ${({ selected }) => selected ? 'black' : '#2b76ed'};
  cursor: ${({ selected }) => selected ? 'default' : 'pointer' };
  text-decoration: ${({ selected }) => selected ? 'none' : 'underline' };
`;

const FarmCount = ActivityCount.extend`
  font-size: 12px;
  color: #fbbd08;
  text-decoration: none;
`;

const RaidSelection = ({ handleSetRaid, handleSetMode, nfCount, raidCount, viewRaid, viewMode }) => {
  return (
    <Grid className="raid-selection" centered columns={3}>
      <Grid.Column >
        <RaidSelect selected={viewRaid==='spire'}>
          <RaidHeading onClick={() => { handleSetRaid('spire'); handleSetMode('prestige');}}>
            <p>Spire</p>
          </RaidHeading>
          <SelectionGroup>
            <Selection
              href="javascript:void(0)"
              selected={viewRaid==='spire' && viewMode ==='normal'}
              onClick={() => { handleSetRaid('spire'); handleSetMode('normal');}}
            >
              <ActivityCount selected={viewRaid==='spire' && viewMode ==='normal'}>
                N {raidCount.spire.successCount.normal}
              </ActivityCount>
              <FarmCount>({raidCount.spire.farmCount.normal})</FarmCount>
            </Selection>
            <Selection
              href="javascript:void(0)"
              selected={viewRaid==='spire' && viewMode ==='prestige'}
              onClick={() => { handleSetRaid('spire'); handleSetMode('prestige');}}
            >
              <ActivityCount selected={viewRaid==='spire' && viewMode ==='prestige'}>
                P {raidCount.spire.successCount.prestige}
              </ActivityCount>
              <FarmCount>({raidCount.spire.farmCount.prestige})</FarmCount>
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
              <ActivityCount selected={viewRaid==='eow' && viewMode ==='normal'}>
                N {raidCount.eow.successCount}
              </ActivityCount>
              <FarmCount>({raidCount.eow.farmCount})</FarmCount>
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
              <ActivityCount selected={viewRaid==='lev' && viewMode ==='normal'}>
                N {raidCount.lev.successCount.normal}
              </ActivityCount>
              <FarmCount>({raidCount.lev.farmCount.prestige})</FarmCount>
            </Selection>
            <Selection
              href="javascript:void(0)"
              selected={viewRaid==='lev' && viewMode ==='prestige'}
              onClick={() => { handleSetRaid('lev'); handleSetMode('prestige');}}
            >
              <ActivityCount selected={viewRaid==='lev' && viewMode ==='prestige'}>
                P {raidCount.lev.successCount.prestige}
              </ActivityCount>
              <FarmCount>({raidCount.lev.farmCount.prestige})</FarmCount>
            </Selection>
          </SelectionGroup>
        </RaidSelect>
      </Grid.Column>
    </Grid>
  );
};

export default RaidSelection;