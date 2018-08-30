import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import shortid from "shortid";

import { Popup } from 'semantic-ui-react';

const RaidViewWrapper = styled.div`
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
  margin-bottom: -18px;
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

const SProgressWrapper =  styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const SStepWrapper = styled.div`
  width: 100%;
  height: 18px;
  display: flex;
  flex-direction: row;
  
  div {
    border-right: 1px solid black;
  }
  
  div:last-of-type {
    border-right: none;
  }
`;

const Step = styled.div`
  width: 20%;
  height: 18px;
  background-color: ${({ bgColor }) => bgColor ? bgColor : '#b8b8b8' };
`;

const determineColor = (startingPhaseIndex) => (stepIndex, farm) => {
  const green = '#21ba45';
  const gray = '#b8b8b8';
  const yellow = '#fbbd08';

  if(farm) {
    startingPhaseIndex = 4;
  }

  return(
    startingPhaseIndex > 0
      ? startingPhaseIndex > stepIndex
        ? gray
          : yellow
      : green
  )

};

const RaidView = ({ raid='nf', raids, handleFetchPGCR, success=true, maxCount }) => {
  const isNF = raid === 'nf';
  const useSmallRaidBar = Object.values(raids).length >= 14;

  const farmKillLimit = raid === 'sp' ? 700 : 400;

  console.log('raids', raids);
  return (
    <RaidViewWrapper success={success} maxCount={Math.abs(maxCount)} neg={maxCount < 0}>
      {raids && Object.values(raids).map(currRaid => {
        const farm = success && currRaid.totalKills < farmKillLimit;
        const startingPhaseIndex = currRaid.startingPhaseIndex || 0;
        const bgColorByIndex = determineColor(startingPhaseIndex);
        const stepArray = [0, 1, 2, 3, 4];

        const time = `${Number.parseFloat(currRaid.values.activityDurationSeconds/60).toFixed(2)}`;
        const percentWidth =  (success && !isNF) ? Number.parseFloat(time).toFixed(0) : 100;
        const popUpContent =
          useSmallRaidBar
            ? (
              <div>
                <BarValues>{ isNF ? currRaid.values.teamScore : `${percentWidth} m`}</BarValues>
                <SProgressWrapper>
                  <SStepWrapper>
                    { stepArray.map(curr => <Step farm={farm} bgColor={bgColorByIndex(curr, farm)} />) }
                  </SStepWrapper>
                </SProgressWrapper>
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
            { (success && !useSmallRaidBar && isNF) && <BarValues>{currRaid.values.teamScore || ''}</BarValues> }
            <SProgressWrapper>
              <SStepWrapper>
                {
                  stepArray.map(curr => {
                    return <Step bgColor={bgColorByIndex(curr, farm)} />
                  })
                }
              </SStepWrapper>
            </SProgressWrapper>
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
    </RaidViewWrapper>
  )
};

RaidView.propTypes = {
  raids: PropTypes.array.isRequired,
  handleFetchPGCR: PropTypes.func.isRequired,
  fail: PropTypes.bool
};

export default RaidView;