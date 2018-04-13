import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import styled from 'styled-components';
import shortid from 'shortid';

import normalize from '../store/normalize';

import RaidSelection from '../components/RaidSelection';
import RaidStack from '../components/RaidStack';
import PlayerSearch from '../components/PlayerSearch';
import * as consts from "../store/constants";

import { SET_PGCR } from "../store/constants";
import { FETCH_PGCR } from "../store/constants";

const PlayerDataViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const RaidView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RaidStackList = styled.div`
  display: flex;
  height: fit-content;
  justify-content: center;
  padding: 15px 15px;
  border-radius: 4px;
  background-color: white;
  
  @media only screen and (max-width: 1100px) {
    width: 75%;
    flex-flow: row-reverse wrap-reverse;
  }
  
  @media only screen and (max-width: 649px) {
    width: 90%;
  }
  
  @media only screen and (min-width: 606px) and (max-width: 739px) {
    width: 95%;
  }
  
  @media only screen and (min-width: 740px) and (max-width: 1100px) {
    width: 90%;
  }
  
  @media only screen and (min-width: 785px) and (max-width: 1100px) {
    width: 85%;
  }
  
  @media only screen and (min-width: 890px) and (max-width: 1100px) {
    width: 75%;
  }
`;

const SearchWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;


class RaidWeekViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: this.props.match.params.playerId || '',
      maxSuccessRaids: 0
    }
  }

  componentDidMount = () => {
    const {handlePlayerSearch, match, history} = this.props;
    handlePlayerSearch(match.params.playerId);

    // Will only be called once the component is mounted
    // PGCR will unmount and cause listener to be cleared
    // This prevents the listener from catch the PGCR back.
    this.unListen = history.listen((location, action) => {
      if(action === 'PUSH' || action === 'POP') {
        if(!!location.state) {
          handlePlayerSearch(location.state.gamerTag);
        }
      }
    });
  };

  componentWillUnmount = () => {
    this.unListen();
  };

  setUpPlayer = (player) => {
    this.setState({ player });
  };

  searchPlayer = (gamerTag) => {
    this.props.history.push(`/player/${gamerTag}`, { gamerTag });
  };

  normalizeRaidWeeks = (raid, history, mode) => normalize.raidWeeks(raid, history, mode);

  setRaid = (raid) => {
    this.props.setViewRaid(raid);
    this.setState({ maxSuccessRaids: 0 });
  };

  setMode = (mode) => {
    this.props.setViewMode(mode);
    this.setState({ maxSuccessRaids: 0 });
  };

  setMaxSuccessRaids = count => {
    this.setState({
      maxSuccessRaids: count
    })
  };

  render() {
    const {
      match, loading, nightfallHistory, raidHistory,
      fetchPostGameCarnageReport, playerProfile, playerPrivacy,
      viewRaid, viewMode, gamerTagOptions, selectGamerTag
    } = this.props;
    const { maxSuccessRaids } = this.state;

    const { notFound } = playerProfile;

    const { nfCount={ prestige: '0', normal: '0' } } = nightfallHistory;
    const {
      mergedHistory,
      raidCount={
        eow: { prestige: '0', normal: '0' },
        lev: { prestige: '0', normal: '0' }
      }
    } = raidHistory;

    let raidWeeks = [];
    const player = match.params.playerId;


    if(viewRaid === 'nf' && !!nightfallHistory[viewMode]) {

      if (Object.keys(nightfallHistory[ viewMode ]).length > 1) {

        //hack get this shit outta here
        const nfLen = Object.entries(nightfallHistory[viewMode]).length;
        const nfStartIndex = Math.abs(5 - nfLen);

        raidWeeks = Object.entries(nightfallHistory[viewMode]).slice(nfStartIndex, nfLen).map((item) => [ ...item ])
      }
    } if(viewRaid === 'eow' || viewRaid === 'lev') {
      raidWeeks = this.normalizeRaidWeeks(viewRaid, mergedHistory, viewMode) || [];
    }

    const shouldRender = (!loading && raidWeeks.length > 0 && !notFound && !playerPrivacy);

    return (
      <PlayerDataViewWrapper>
        <SearchWrapper loading={loading}>
          <PlayerSearch
            gamerTagOptions={gamerTagOptions}
            playerId={player}
            handlePlayerSearch={this.searchPlayer}
            selectGamerTag={selectGamerTag}
          />
        </SearchWrapper>

        <RaidView>
          { playerPrivacy && <h1 style={{ fontSize: 24 }}>The player has set their account to private</h1>}
          { notFound && <h1 style={{ fontSize: 24 }}>Sorry player not found</h1> }
          {(!loading && !notFound) &&
            <RaidSelection
              handleSetRaid={this.setRaid} handleSetMode={this.setMode}
              nfCount={nfCount} raidCount={raidCount}
              viewRaid={viewRaid} viewMode={viewMode}
              resetMaxSuccessRaids={() => this.setMaxSuccessRaids(0)}
            />
          }
          {shouldRender &&
            <RaidStackList>
              {raidWeeks.map(raidWeek => {
                return (
                  <RaidStack
                    key={shortid.generate()}
                    handleFetchPGCR={fetchPostGameCarnageReport}
                    raidWeek={raidWeek}
                    raid={viewRaid}
                    maxSuccessRaids={maxSuccessRaids}
                    handleSetMaxSuccessRaids={this.setMaxSuccessRaids}
                  />
                )
              })}
            </RaidStackList>
          }
        </RaidView>
      </PlayerDataViewWrapper>
    )
  }
}

const mapStateToProps = state => {
  return {
    pgcr: state.postGameCarnageReport,
    loading: state.loading,
    viewMode: state.viewMode,
    viewRaid: state.viewRaid,
    nightfallHistory: state.nightfallHistory,
    raidHistory: state.raidHistory,
    playerProfile: state.playerProfile,
    playerPrivacy: state.playerPrivacy,
    gamerTagOptions: state.gamerTagOptions
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchPostGameCarnageReport: pathParams => dispatch({type: FETCH_PGCR, data: pathParams}),
    clearPostGameCarnageReport: () => dispatch({ type: SET_PGCR, data: false}),
    searchPlayer: pathParams => dispatch({ type: consts.FETCH_PLAYER_PROFILE, data: pathParams }),
    setViewRaid: raid => dispatch({ type: consts.SET_VIEW_RAID, data: raid }),
    setViewMode: mode => dispatch({ type: consts.SET_VIEW_MODE, data: mode }),
    selectGamerTag: gamerTag => dispatch({ type: consts.SELECT_GAMER_TAG, data: gamerTag })
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RaidWeekViewer));