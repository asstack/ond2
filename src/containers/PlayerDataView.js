import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import shortid from 'shortid';

import normalize from '../store/normalize';

import RaidSelection from '../components/RaidSelection';
import RaidStack from '../components/RaidStack';
import PlayerSearch from '../components/PlayerSearch';
import * as consts from "../store/constants";
import { connect } from "react-redux";
import { SET_PGCR } from "../store/constants";
import { FETCH_PGCR } from "../store/constants";

const RaidView = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
`;

const RaidStackList = styled.div`
  display: flex;
  flex-direction: row;
  flex-flow: row wrap;
  justify-content: center;
  width: 1100px;
  padding: 10px 15px 50px 15px;
  background-color: skyblue;
`;

const SearchWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${(props) => props.loading ? "div { display: none; }" : ''}
`;

class RaidWeekViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: this.props.match.params.playerId || ''
    }
  }

  componentDidMount() {
    const {handlePlayerSearch, match, history} = this.props;
    handlePlayerSearch(match.params.playerId);

    history.listen((location, action) => {
      console.log('history listen location', location);
      console.log('history listen action', action);
      if(action === 'PUSH' || action === 'POP') {
        console.log('location.state', !!location.state);
        if(!!location.state) {
          handlePlayerSearch(location.state.gamerTag);
        }
      }
    });
  }

  setUpPlayer = (player) => {
    this.setState({ player });
  };

  searchPlayer = (gamerTag) => {
    this.props.history.push(`/destiny/player/${gamerTag}`, { gamerTag });
  };

  normalizeRaidWeeks = (raid, history, mode) => normalize.raidWeeks(raid, history, mode);

  setRaidWeeks = (raidWeeks) => {
    this.setState({ raidWeeks });
  };

  setRaid = (raid) => {
    this.props.setViewRaid(raid);
  };

  setMode = (mode) => {
    this.props.setViewMode(mode);
  };

  //shouldComponentUpdate = (nextProps) => {
  //  //console.log('this.props', this.props);
  //  //console.log('nextProps', nextProps);
  //  const wee = (
  //    this.props.playerProfile.displayName !== nextProps.playerProfile.displayName ||
  //    this.props.raidHistory.raidCount.eow.prestige !== nextProps.raidHistory.raidCount.eow.prestige ||
  //    this.props.raidHistory.raidCount.eow.normal !== nextProps.raidHistory.raidCount.eow.normal ||
  //    this.props.raidHistory.raidCount.lev.prestige !== nextProps.raidHistory.raidCount.lev.prestige ||
  //    this.props.raidHistory.raidCount.lev.normal !== nextProps.raidHistory.raidCount.lev.normal ||
  //    this.props.nightfallHistory.nfCount.prestige !== nextProps.nightfallHistory.nfCount.prestige ||
  //    this.props.nightfallHistory.nfCount.normal !== nextProps.nightfallHistory.nfCount.normal ||
  //    this.props.viewRaid !== nextProps.viewRaid ||
  //    this.props.viewMode !== nextProps.viewMode ||
  //    !!nextProps.playerProfile.notFound
  //  );
  //  console.log('wee', wee);
  //  return wee;
  //};

  render() {
    const {
      match, loading, nightfallHistory, raidHistory,
      fetchPostGameCarnageReport, playerProfile, playerPrivacy,
      viewRaid, viewMode
    } = this.props;

    const { notFound } = playerProfile;

    const { nfCount={ prestige: '#', normal: '#' } } = nightfallHistory;
    const {
      mergedHistory,
      raidCount={
        eow: { prestige: '#', normal: '#' },
        lev: { prestige: '#', normal: '#' }
      }
    } = raidHistory;

    let raidWeeks = [];
    const player = match.params.playerId;

    if(viewRaid === 'nf' && !!nightfallHistory[viewMode]) {
      if (Object.keys(nightfallHistory[ viewMode ]).length > 1) {
        raidWeeks = Object.entries(nightfallHistory[viewMode]).map((item) => [ item[ 0 ], item[ 1 ] ])
      }
    } else {
      raidWeeks = this.normalizeRaidWeeks(viewRaid, mergedHistory, viewMode) || [];
    }

    const shouldRender = (!loading && raidWeeks.length > 0 && !notFound && !playerPrivacy);

    return (
      <div>
        <SearchWrapper loading={loading}>
          <PlayerSearch
            playerId={player}
            handlePlayerSearch={this.searchPlayer}/>
        </SearchWrapper>

        <RaidView>
          { playerPrivacy && <h1 style={{ fontSize: 24 }}>The player has set their account to private</h1>}
          { notFound && <h1 style={{ fontSize: 24 }}>Sorry player not found</h1> }
          {(!loading && !notFound) &&
            <RaidSelection
              handleSetRaid={this.setRaid} handleSetMode={this.setMode}
              nfCount={nfCount} raidCount={raidCount}
              viewRaid={viewRaid} viewMode={viewMode}
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
                  />
                )
              })}
            </RaidStackList>
          }
        </RaidView>
      </div>
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
    gamerTagSuggestions: state.gamerTagSuggestions
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