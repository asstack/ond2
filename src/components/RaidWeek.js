import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import shortid from "shortid";

import ScoreView from '../components/ScoreView';

const RaidWeekWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${({ success }) => success ? 'flex-end' : 'flex-start' };
  align-items: center;
  height: 45%;
  border-top: 1px solid black;
  background-color: white;
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
  const renderScore = raid === 'nf';
  return (
    <RaidWeekWrapper success={success}>
      {raids && Object.values(raids).map(raid => (
        <RaidStackItems
          onClick={() => handleFetchPGCR(raid.activityDetails.instanceId)}
          percentComplete={((raid.values.score / raid.values.teamScore) * 100).toFixed(0)}
          key={shortid.generate()}
          activityCount={1}
          success={success}>
          <Link className="pgcr-link" to={`/destiny/pgcr/${raid.activityDetails.instanceId}`}>
            { renderScore &&
              <ScoreView teamScore={raid.values.teamScore} score={((raid.values.score / raid.values.teamScore) * 100).toFixed(0)}/>
            }
          </Link>
        </RaidStackItems>
      ))
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