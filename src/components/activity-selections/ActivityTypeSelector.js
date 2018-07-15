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
  
  font-family: Montserrat;
  font-size: 26px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  
  @media only screen and (max-width: 767px) {
    text-align: center;
    font-size: 14px;
  }
  
  @media only screen and (max-width: 875px) {
    left: 5%;
  }
  
  @media only screen and (min-width: 875px) and (max-width: 1100px) {
    left: 5%;
  }
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
  
  @media only screen and (max-width: 767px) {
    height: 35px;  
  }
`;

const ActivityTypeSelector = (props) => {
  return (
    <Grid className="raid-selection" container={true}>
      <Grid.Row style={{ paddingBottom: 0 }} container="true">
        <TypeSelectorContainer>
          <ActivitySelector onClick={ () => props.handleSetActivityType('raid') } selected={props.activityType === 'raid'}>
            <p>Raids</p>
          </ActivitySelector>
          <ActivitySelector onClick={ () => props.handleSetActivityType('activity') } selected={props.activityType === 'activity'}>
            <p>Activities</p>
          </ActivitySelector>
        </TypeSelectorContainer>
      </Grid.Row>
      <Grid.Row style={{ paddingTop: 0, paddingRight: 1 }} container="true">
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