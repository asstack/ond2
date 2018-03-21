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
`;

const RaidStackItems = styled.div`
  display: flex;
  flex-direction: row;
  height: 20px;
  width: 60%;
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
    width: ${({ activityCount }) => (100 / activityCount)}%;
    text-decoration: none;
  }
  
  .pgcr-link {
    color: white;
    font-size: 14px;
    font-family: san-serif;
  }
`;

const RaidWeek = ({ raid='', raids, handleFetchPGCR, success=true }) => {
  const renderScore = raid === 'nf';

  return (
    <RaidWeekWrapper success={success}>
      {raids && Object.values(raids).map(raid => (
        <RaidStackItems
          onClick={() => handleFetchPGCR(raid.activityDetails.instanceId)}
          key={shortid.generate()}
          activityCount={1}
          success={success}>
          <Link className="pgcr-link" to={`/destiny/pgcr/${raid.activityDetails.instanceId}`}>
            { renderScore && <ScoreView teamScore={raid.values.teamScore} score={raid.values.score}/> }
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