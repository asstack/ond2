import React, { Component } from 'react';
import { withRouter, Route } from 'react-router-dom';
import { connect } from "react-redux";
import styled from 'styled-components';
import shortid from 'shortid';
import { isMobile } from 'react-device-detect';

import { Grid } from 'semantic-ui-react';

import ActivityTypeSelector from '../components/activity-selections/ActivityTypeSelector';
import RaidStack from '../components/RaidStack';
import PlayerSearch from '../components/PlayerSearch';
import * as consts from "../store/constants";

import { SET_PGCR } from "../store/constants";
import { FETCH_PGCR } from "../store/constants";


const PlayerDataViewWrapper = styled.div`
  &&& {
    width: 100%;
    margin-bottom: 20px;
    
    .raid-selection {
    
      .column {
        padding: 0;
      }
    }
    
    .raid-stack-row {
      padding-top: 0 !important;
      justify-content: ${({ flexMobile } ) => flexMobile ? 'flex-start !important' : 'flex-end !important'};
      background-color: white;
      border-left: 1px solid #BEBEBE;
      border-right: 1px solid	#BEBEBE;
      border-bottom: 1px solid	#BEBEBE;
      padding-left: 1px;
      
      .column {
        padding: 0;
      }
    }
  }
`;

class RaidWeekViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      player: this.props.match.params.playerId || '',
      maxSuccessRaids: 0,

    };

    this.yOffsetRef = React.createRef();
  }

  componentDidMount = () => {
    const {handlePlayerSearch, match, history} = this.props;
    handlePlayerSearch(match.params.playerId);

    // Prevents a new search on "history back" actions.
    history.listen((location, action) => {
      if(action === 'PUSH' || action === 'POP') {
        if(!!location.state && !location.state.modal) {
          this.props.clearErrorState();
          handlePlayerSearch(location.state.gamerTag);
        }
      }
    });
  };

  searchPlayer = (gamerTag) => {
    this.props.history.push(`/player/${gamerTag}`, { gamerTag });
  };

  normalizeRaidWeeks = (raids={}, size=6) => Object.entries(raids).reverse().slice(0, size);

  setRaid = (raid) => {
    this.props.setViewRaid(raid);
    this.setState({ maxSuccessRaids: 0 });
  };

  setMode = (mode) => {
    this.props.setViewMode(mode);
    this.setState({ maxSuccessRaids: 0 });
  };

  setActivity = (activity) => {
    const type = activity === 'raid' ? 'spire' : 'nf';
      this.props.setActivityType(activity, type);
  };

  setMaxSuccessRaids = count => {
    this.setState({
      maxSuccessRaids: count
    })
  };

  checkPlayerForEmpty = (statePlayer, player) => {
    if(statePlayer === '') {
      this.setState({ player: player });
    }
  };

  setFarmCount = (farmCount) => {
    this.setState({ farmCount })
  };

  render() {
    const {
      match, loading, nightfallHistory, raidHistory, epHistory,
      fetchPostGameCarnageReport, playerProfile, playerPrivacy,
      viewRaid, viewMode, gamerTagOptions, selectGamerTag,
      setActivityType, publicMilestones, activityType
    } = this.props;
    const { maxSuccessRaids } = this.state;

    const { notFound } = playerProfile;

    const { nfSuccessCount={ prestige: '0', normal: '0' } } = nightfallHistory;
    const { EP={}, epSuccessCount='0' } = epHistory;
    const {
      LEV={ prestige: {}, normal: {}},
      SPIRE={ prestige: {}, normal: {}},
      EOW={},
      raidCount={
          eow: {
            prestige: '0',
            normal: '0',
            successCount: '0',
            farmCount: '0'
          },
          lev: {
            prestige: '0',
            normal: '0',
            successCount: {
              prestige: '0',
              normal: '0'
            },
            farmCount: {
              prestige: '0',
              normal: '0'
            }
          },
          spire: {
            prestige: '0',
            normal: '0',
            successCount: {
              prestige: '0',
              normal: '0'
            },
            farmCount: {
              prestige: '0',
              normal: '0'
            }
          }
        }
    } = raidHistory;

    let raidWeeks = [];
    const player = match.params.playerId;

    this.checkPlayerForEmpty(this.state.player, player);

    if(viewRaid === 'nf' && !!nightfallHistory[viewMode]) {

      if (Object.keys(nightfallHistory[ viewMode ]).length > 1) {
        const nfLen = Object.entries(nightfallHistory[viewMode]).length;
        const nfStartIndex = Math.abs(6 - nfLen);
        raidWeeks = Object.entries(nightfallHistory[viewMode]).slice(nfStartIndex, nfLen).map((item) => [ ...item ]).reverse()
      }
    }
    else if(viewRaid === 'eow'){
      raidWeeks = Object.entries(EOW).reverse().slice(0, 6)
    }
    else if(viewRaid === 'lev') {
      raidWeeks = Object.entries(LEV[viewMode]).reverse().slice(0, 6)
    }
    else if(viewRaid === 'spire') {
      raidWeeks = Object.entries(SPIRE[viewMode]).reverse().slice(0, 6);
    }
    else if(viewRaid === 'ep') {
      raidWeeks = Object.entries(EP).reverse().slice(0, 6);
    }

    const shouldRender = (!loading && raidWeeks.length > 0 && !notFound && !playerPrivacy);

    return (
      <PlayerDataViewWrapper flexMobile={isMobile} ref={this.yOffsetRef}>

        <Grid stackable={true} container centered>
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

          <Grid.Row style={{ paddingBottom: 0}} centered>
          {
            (!loading && !notFound) &&
              <ActivityTypeSelector
                handleSetRaid={this.setRaid} handleSetMode={this.setMode} epSuccessCount={epSuccessCount}
                handleSetActivityType={this.setActivity} nfSuccessCount={nfSuccessCount} raidCount={raidCount}
                activityType={activityType} viewRaid={viewRaid} viewMode={viewMode}
                resetMaxSuccessRaids={() => this.setMaxSuccessRaids(0)}
              />
          }
          </Grid.Row>

            {shouldRender &&
              <Grid.Row reversed='computer tablet' className="raid-stack-row" columns={6}>
                {raidWeeks.map((raidWeek, idx) => {
                  return (
                    <Grid.Column textAlign="center" key={shortid.generate()}>
                      <RaidStack
                        handleFetchPGCR={fetchPostGameCarnageReport}
                        weekTitle={publicMilestones[idx]}
                        viewRaid={viewRaid}
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
    activityType: state.activityType,
    viewRaid: state.viewRaid,
    nightfallHistory: state.nightfallHistory,
    raidHistory: state.raidHistory,
    epHistory: state.epHistory,
    playerProfile: state.playerProfile,
    playerPrivacy: state.playerPrivacy,
    gamerTagOptions: state.gamerTagOptions,
    publicMilestones: state.publicMilestones,
    raidViewYOffset: state.raidViewYOffset
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchPostGameCarnageReport: pathParams => dispatch({type: FETCH_PGCR, data: pathParams}),
    clearPostGameCarnageReport: () => dispatch({ type: SET_PGCR, data: false}),
    searchPlayer: pathParams => dispatch({ type: consts.FETCH_PLAYER_PROFILE, data: pathParams }),
    setViewRaid: raid => dispatch({ type: consts.SET_VIEW_RAID, data: raid }),
    setViewMode: mode => dispatch({ type: consts.SET_VIEW_MODE, data: mode }),
    setActivityType: (type, raid) => ([
      dispatch({ type: consts.SET_ACTIVITY_TYPE, data: type }),
      dispatch({ type: consts.SET_VIEW_RAID, data: raid })
    ]),
    selectGamerTag: gamerTag => dispatch({ type: consts.SELECT_GAMER_TAG, data: gamerTag }),
    setYOffset: yOffset => dispatch({ type: consts.SET_RAID_VIEW_Y_OFFSET, data: yOffset })
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RaidWeekViewer));