import React, { Component } from 'react';
import { Route, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';

import RaidWeekViewer from '../../components/RaidWeekViewer';
import { FETCH_PLAYER_PROFILE } from "../../store/constants";

class PlayerSearchContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerSearch: '',
      internal: false,
    }
  }

  handlePlayerInput = ({ target}) => {
    this.setState({
      playerSearch: target.value
    });
  };

  searchDestinyPlayer = (playerSearch) => {
    const { history, searchPlayer } = this.props;
    this.setState({ playerSearch: playerSearch});
    history.push(`/destiny/player/${playerSearch}`);
    searchPlayer({ displayName: playerSearch, membershipType: -1 });
  };

  render() {
    const { playerSearch } = this.state;

    const internalRouting = playerSearch.length > 0;

    return(
      <PlayerSearchWrapper>
        <PlayerSearchSection>
          <form onSubmit={(e) => { e.preventDefault(); return this.searchDestinyPlayer(playerSearch) }}>
            <Input placeholder="Gamer Tag" value={playerSearch} onChange={this.handlePlayerInput} />
          </form>
        </PlayerSearchSection>

        <RaidReportSection>
          <Route path="/destiny/player/:playerId" render={(data) => (
            <RaidWeekViewer internalRouting={internalRouting} handleDeepLink={this.searchDestinyPlayer} {...this.props} {...data} />
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
    playerPrivacy: state.playerPrivacy
  }
};

const mapDispatchToProps = dispatch => {
  return {
    searchPlayer: pathParams => dispatch({type: FETCH_PLAYER_PROFILE, data: pathParams}),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(PlayerSearchContainer));

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
