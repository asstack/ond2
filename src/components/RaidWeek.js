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
  height: 299px;
  width: 100%;
  border-top: 1px solid #d9d9d9;
  background-color: transparent;
  overflow: hidden;
  overflow-y: scroll;
  
  ::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
  }
  
  @media only screen and (min-width: 400px) and (max-width: 750px) {
    height: 199px;
  }
  
  @media only screen and (min-width: 750px) and (max-width: 1250px) {
    height: 199px;
  }
  
  .pgcr-link {
    width: 100%;
    margin: 0 0 0 0;
    background-color: #f3f3f3;
    border: solid 1px #d9d9d9;
    
    .progress {
      border-radius: 0 !important;
      margin: 0 0 0 0 !important;  
    }
    
    
    .small {
      height: 20px !important;
      
      .bar {
        height: 20px !important;
        border-radius: 0 !important;
      }
    }
    
    .tiny {
      height: 10px; !important;
      
      .bar {
        height: 10px !important;
        border-radius: 0 !important;
      }
    }
  }
`;

const BarValues = styled.span`
  width: 100%;
  height: 100%;
  float: ${({ floatDirection }) => floatDirection || 'none'};
  background-color: transparent;
  z-index: 10;
  padding: 0 5px;
 
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: ${({ floatDirection }) => floatDirection || 'right'};;
  color: #383838;
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
`;

//${({ percentComplete, success }) => !!success ? percentComplete : 100 }%;
const RaidWeek = ({ raid='', raids, handleFetchPGCR, success=true }) => {
  const isNF = raid === 'nf';
  const manyRaids = Object.values(raids).length > 14;

  return (
    <RaidWeekWrapper success={success}>
      {raids && Object.values(raids).map(raid => {
        const size = success ? manyRaids ? 'tiny' : 'small' : 'tiny';

        // TODO: Can timePlayedSeconds be vastly different than activityDurationSeconds?
        const time = `${Number.parseFloat(raid.values.activityDurationSeconds/60).toFixed(2)}`;
        const content = isNF
          ?
          `Score: ${raid.values.score}/${raid.values.teamScore} | ${time}m`
          : `KDA: ${raid.values.kills} / ${raid.values.deaths} / ${raid.values.assists}`;

        const value = success
          ? isNF
            ? raid.values.score : time
            : 100;

        const total = success
          ? isNF
            ? raid.values.teamScore : 180
            : 100;

        return (
          <Popup
            key={shortid.generate()}
            content={content}
            trigger={
              <Link className="pgcr-link" to={ `/pgcr/${raid.activityDetails.instanceId}` }>
                { (success && isNF) && <BarValues floatDirection="right">{raid.values.teamScore || ''}</BarValues> }
                { (success && !isNF) && <BarValues floatDirection="left">{time}m</BarValues> }
                <Progress
                  onClick={() => handleFetchPGCR(raid.activityDetails.instanceId)}
                  value={value}
                  total={total}
                  on={['hover', 'focus']}
                  size={size}
                  success={success}
                  error={!success}
                />
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