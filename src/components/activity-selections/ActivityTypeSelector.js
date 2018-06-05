import React from 'react';
import { Grid } from 'semantic-ui-react';

import RaidSelection from "./RaidSelection";
import ActivitiesSelection from "./ActivitiesSelection";
import styled from 'styled-components';

const TypeSelectorContainer = styled.div`
  width: 40%;
  height: 50px;
  display: flex;
  flex-direction: row;
  border: 1px solid black;
  cursor: pointer;
`;

const ActivitySelector = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: ${({ selected }) => selected ? 'white' : '#eeeeee'};
`;



const ActivityTypeSelector = (props) => {
  return (
    <Grid container centered>
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
      <Grid.Row style={{ paddingTop: 0 }} container>
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