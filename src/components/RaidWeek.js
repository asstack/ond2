import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import shortid from "shortid";

import { Popup, Progress } from 'semantic-ui-react';

const RaidWeekWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: ${({ success }) => success ? 'flex-end' : 'flex-start' };
  align-items: center;
  height: ${({ success, maxCount, neg }) => {
    const size = neg ? 12 : 24;
    return success ? `${(size * maxCount) + maxCount + 12}px` : 'fit-content'
  }};
  width: 98%;
  max-height: 299px;
  background-color: transparent;
  overflow: hidden;
  overflow-y: scroll;
  
  ::-webkit-scrollbar {
    width: 0px;  /* remove scrollbar space */
    background: transparent;  /* optional: just make scrollbar invisible */
  }
  
  @media only screen and (max-width: 716px) {
    width: 100%;
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
  height: 18px;
  float: left;
  position: relative;
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
  text-align: right;
  color: #383838;
`;

const RaidWeek = ({ raid='nf', raids, handleFetchPGCR, success=true, maxCount }) => {
  const isNF = raid === 'nf';
  const manyRaids = Object.values(raids).length >= 14;

  const farmKillLimit = raid === 'sp' ? 700 : 400;

  return (
    <RaidWeekWrapper success={success} maxCount={Math.abs(maxCount)} neg={maxCount < 0}>
      {raids && Object.values(raids).map(currRaid => {
        const tinyBarSizeRequired = manyRaids || !success;
        const color = success
          ? currRaid.totalKills >= farmKillLimit || raid === 'nf'
            ? 'green'
              : 'yellow'
          : 'red';

        const barSize = tinyBarSizeRequired ? 'tiny' : 'small';
        const time = `${Number.parseFloat(currRaid.values.activityDurationSeconds/60).toFixed(2)}`;
        const value = success ? isNF ? currRaid.values.score : time : 100;
        const total = success ? isNF ? currRaid.values.teamScore : 120 : 100;
        const percentWidth =  (success && !isNF) ? Number.parseFloat(time).toFixed(0) : 100;
        const popUpContent =
          manyRaids
            ? (
              <div>
                <BarValues>{ isNF ? currRaid.values.teamScore : `${percentWidth} m`}</BarValues>
                <Progress style={{ minWidth: 150}} value={value} total={total} size="small" color={color} />
                Kill Rank ({currRaid.killRank}-{currRaid.teamCount})
                <br />
                Death Rank: ({currRaid.killRank}-{currRaid.teamCount})
              </div>
            ) :
            <div>
              Kill Rank ({currRaid.killRank}-{currRaid.teamCount})
              <br />
              Death Rank: ({currRaid.killRank}-{currRaid.teamCount})
            </div>;


        const RaidProgressBar = (
          <Link className="pgcr-link" to={{ pathname: `/pgcr/${currRaid.instanceId}`, state: { modal: true } }} >
            { (success && !manyRaids && isNF) && <BarValues>{currRaid.values.teamScore || ''}</BarValues> }
            { (success && !manyRaids && !isNF) && <BarValues>{percentWidth}m</BarValues> }
            <Progress
              onClick={() => handleFetchPGCR(currRaid.instanceId)}
              value={value || 0}
              total={total || 0}
              on={['hover', 'focus']}
              size={barSize}
              color={color}
            />
          </Link>
        );

        return (
          <Popup
            key={shortid.generate()}
            trigger={RaidProgressBar}>
            <Popup.Content>
              {popUpContent}
            </Popup.Content>
          </Popup>
        )
      })
      }
    </RaidWeekWrapper>
  )
};

RaidWeek.propTypes = {
  raids: PropTypes.array.isRequired,
  handleFetchPGCR: PropTypes.func.isRequired,
  fail: PropTypes.bool
};

export default RaidWeek;