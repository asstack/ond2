import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import RaidWeekViewer from '../../components/RaidWeekViewer';
import { FETCH_PLAYER_PROFILE, SET_VIEW_MODE, SET_VIEW_RAID, SET_NEW_PLAYER_SEARCH } from "../../store/constants";

class PlayerSearchContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerSearch: this.props.playerProfile.displayName || this.props.match.params.playerId || '',
      inputActivity: false,
      internal: false,
    }
  }

  handlePlayerInput = ({ target}) => {
    this.setState({
      playerSearch: target.value,
      inputActivity: true
    });
  };

  handleSetPlayerSearch = (displayName) => {
    console.log('handle search', displayName);
    this.setState({ playerSearch: displayName });
  };

  searchDestinyPlayer = (playerSearch) => {
    const { history, searchPlayer } = this.props;
    searchPlayer({ displayName: playerSearch, membershipType: -1 });
    this.setState({ inputActivity: true });
    history.push(`/destiny/player/${playerSearch}`);
  };

  deepLinkSearch = (playerSearch) => {

    const { searchPlayer } = this.props;
    searchPlayer({ displayName: playerSearch, membershipType: -1 });
    this.setState({ inputActivity: true });
  };


  render() {
    const { inputActivity, playerSearch } = this.state;

    const { playerProfile } = this.props;
    //if(playerSearch === '' && playerProfile.displayName || playerProfile.displayName !== playerSearch) {
    //  this.setState({ playerSearch: playerProfile.displayName });
    //}
    const internalRouting = inputActivity;

    return(
      <PlayerSearchWrapper>
        <PlayerSearchSection>
          <form onSubmit={(e) => { e.preventDefault(); return this.searchDestinyPlayer(playerSearch) }}>
            <Input placeholder="Gamer Tag" value={playerSearch} onChange={this.handlePlayerInput} />
          </form>
        </PlayerSearchSection>

        <RaidReportSection>
          <Route path="/destiny/player/:playerId" render={(data) => (
            <RaidWeekViewer
              internalRouting={internalRouting} handleSetPlayerSearch={this.handleSetPlayerSearch}
              handleDeepLink={this.deepLinkSearch} {...this.props} {...data}
          />
          )}/>
        </RaidReportSection>
      </PlayerSearchWrapper>
    )
  }
}

const mapStateToProps = state => {
  return {
    playerProfile: state.playerProfile,
    raidHistory: state.raidHistory,
    nightfallHistory: state.nightfallHistory,
    playerPrivacy: state.playerPrivacy,
    viewRaid: state.viewRaid,
    viewMode: state.viewMode,
    newPlayerSearch: state.newPlayerSearch
  }
};

const mapDispatchToProps = dispatch => {
  return {
    searchPlayer: pathParams => dispatch({ type: FETCH_PLAYER_PROFILE, data: pathParams }),
    setViewMode: mode => dispatch({ type: SET_VIEW_MODE, data: mode }),
    setViewRaid: mode => dispatch({ type: SET_VIEW_RAID, data: mode })
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PlayerSearchContainer));

const PlayerSearchWrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const PlayerSearchSection = styled.div`
  margin: 75px 0 30px 0;
  
  & > h4, p {
    display: inline-block;
    margin-top: 15px;
  }
`;

const RaidReportSection = styled.section`
  width: 100%;
  margin-top: 10px;
`;

const Input = styled.input`
  width: 300px;
  height: 40px;
  font-size: 24px;
  margin-left: 10px;
  border-radius: 3px;
  padding: 5px;
`;
