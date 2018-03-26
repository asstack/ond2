import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import shortid from "shortid";

import { Popup, Progress } from 'semantic-ui-react';

import ScoreView from '../components/ScoreView';

const RaidWeekWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${({ success }) => success ? 'flex-end' : 'flex-start' };
  align-items: center;
  height: 45%;
  width: 100%;
  border-top: 1px solid #d9d9d9;
  background-color: white;
  overflow: hidden;
  overflow-y: scroll;
  
  ::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
  }
  
  .pgcr-link {
    width: 100%;
    margin: 1px 0 0 0;
    
    .progress {
      border-radius: 0 !important;
      margin: 0 0 0 0 !important;
    }
    
    .bar {
      border-radius: 0 !important;
    }
  }
  
`;

const RaidStackItems = styled.div`
  display: flex;
  flex-direction: row;
  height: 20px;
  width: 100%;
  ${({ success }) => success ? 'margin-bottom: -1px' : null};
  ${({ success }) => success ? null: 'margin-top: -1px'};
  
  & a {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding-right: 5px;
    height: 100%;
    border-left: 1px solid black;
    border-top: 1px solid black;
    background-color: ${({ success }) => !!success ? 'green' : 'red'};
    width: 100%;
    text-decoration: none;
  }
  
  .pgcr-link {
    color: white;
    font-size: 14px;
    font-family: san-serif;
  }
`;

//${({ percentComplete, success }) => !!success ? percentComplete : 100 }%;

const RaidWeek = ({ raid='', raids, handleFetchPGCR, success=true }) => {
  const isNF = raid === 'nf';
  const manyRaids = Object.values(raids).length > 8;

  // If success && Object.values(raids) > 7
  // (Remove ScoreView and add tooltip) OR (add tooltip to all and remove on condition)
  return (
    <RaidWeekWrapper success={success}>
      {raids && Object.values(raids).map(raid => {
        const size = success ? manyRaids ? 'tiny' : 'small' : 'tiny';

        const content = isNF
          ? `Score: ${raid.values.score} / ${raid.values.teamScore}` : `KDA: ${raid.values.kills} / ${raid.values.deaths} / ${raid.values.assists}`;

        return (
          <Popup
            key={shortid.generate()}
            content={content }
            trigger={
              <Link className="pgcr-link" to={ `/destiny/pgcr/${raid.activityDetails.instanceId}` }>
                <Progress
                  onClick={() => handleFetchPGCR(raid.activityDetails.instanceId)}
                  value={raid.values.score || 100 }
                  total={raid.values.teamScore || 100 }
                  size={size}
                  success={success}
                  error={!success}
                >
                </Progress>
              </Link>
            }/>
        )
      })
      }
    </RaidWeekWrapper>
  )
}

RaidWeek.propTypes = {
  raids: PropTypes.array.isRequired,
  handleFetchPGCR: PropTypes.func.isRequired,
  fail: PropTypes.bool
};

export default RaidWeek;