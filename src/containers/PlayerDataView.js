import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import styled from 'styled-components';
import shortid from 'shortid';

import { Grid } from 'semantic-ui-react';

import normalize from '../store/normalize';

import RaidSelection from '../components/RaidSelection';
import RaidStack from '../components/RaidStack';
import PlayerSearch from '../components/PlayerSearch';
import * as consts from "../store/constants";

import { SET_PGCR } from "../store/constants";
import { FETCH_PGCR } from "../store/constants";

const PlayerDataViewWrapper = styled.div`
  &&& {
    width: 100%;
    
    .row {
      padding: 0;  
    }
    
    .raid-selection {
      max-width: 90%;
      
      .column {
        padding: 0;
      }
    }
    
    .raid-stack-row {
      background-color: white;
      padding: 15px;
      
      .column {
        padding: 0;
      }
    }
  }
`;

const RaidView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const RaidStackList = styled.div`
  width: 100%;
  padding: 15px 15px;
  border-radius: 4px;
  background-color: white;
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

    // Prevents a new search on "history back" actions.
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
        <Grid stackable container centered>
          <Grid.Row centered>
            <PlayerSearch
              gamerTagOptions={gamerTagOptions}
              playerId={player}
              handlePlayerSearch={this.searchPlayer}
              selectGamerTag={selectGamerTag}
            />
          </Grid.Row>

          { playerPrivacy && <Grid.Row><h1 style={{ fontSize: 24 }}>The player has set their account to private</h1></Grid.Row>}
          { notFound && <Grid.Row><h1 style={{ fontSize: 24 }}>Sorry player not found</h1></Grid.Row> }

          <Grid.Row>
          {
            (!loading && !notFound) &&
              <RaidSelection
                handleSetRaid={this.setRaid} handleSetMode={this.setMode}
                nfCount={nfCount} raidCount={raidCount}
                viewRaid={viewRaid} viewMode={viewMode}
                resetMaxSuccessRaids={() => this.setMaxSuccessRaids(0)}
              />
          }
          </Grid.Row>


            {shouldRender &&
              <Grid.Row className="raid-stack-row" columns={5} centered>
                {raidWeeks.map(raidWeek => {
                  return (
                    <Grid.Column textAlign="center">
                      <RaidStack
                        key={shortid.generate()}
                        handleFetchPGCR={fetchPostGameCarnageReport}
                        raidWeek={raidWeek}
                        raid={viewRaid}
                        maxSuccessRaids={maxSuccessRaids}
                        handleSetMaxSuccessRaids={this.setMaxSuccessRaids}
                      />
                    </Grid.Column>
                  )
                })}
              </Grid.Row>
            }
        </Grid>
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