import React from 'react';
import { Grid } from 'semantic-ui-react';

import RaidSelection from "./RaidSelection";
import ActivitiesSelection from "./ActivitiesSelection";
import styled from 'styled-components';

const ActivitySelector = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  ${({ selected }) => selected ? '' : 'text-decoration: underline'};
  ${({ selected }) => selected ? 'border: 1px solid #BEBEBE' : ''};
  border-bottom: none;
  background-color: ${({ selected }) => selected ? 'white' : '#eeeeee'};
  color: ${({ selected }) => selected ? 'black' : '#2b76ed'};
  ${({ selected }) => selected ? 'z-index: 40' : 'z-index: 0'};
`;

const TypeSelectorContainer = styled.div`
  width: 60%;
  height: 50px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  margin-bottom: -1px;
  
  & ${ActivitySelector}:first-child {
    margin-right: 10px;
  }
  
  @media only screen and (min-width: 767px) {
    width: 40%;
  }
`;

const ActivityTypeSelector = (props) => {
  return (
    <Grid className="raid-selection" container>
      <Grid.Row style={{ paddingBottom: 0 }} container>
        <TypeSelectorContainer>
          <ActivitySelector onClick={ () => props.handleSetActivityType('raid') } selected={props.activityType === 'raid'}>
            <p>Raids</p>
          </ActivitySelector>
          <ActivitySelector onClick={ () => props.handleSetActivityType('activity') } selected={props.activityType === 'activity'}>
            <p>Activities</p>
          </ActivitySelector>
        </TypeSelectorContainer>
      </Grid.Row>
      <Grid.Row style={{ paddingTop: 0, paddingRight: 1 }} container>
        {
          props.activityType === 'raid'
            ? <RaidSelection {...props} />
            : <ActivitiesSelection {...props} />
        }
      </Grid.Row>
    </Grid>
  );
};

export default ActivityTypeSelector;