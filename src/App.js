import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import baseStyles from './base-styles';
import { destinyBaseURL } from "./services/destiny-endpoints";
import {
  fetchProfile,
  fetchCharacters,
  fetchGroupsForMembers,
  fetchActivityHistory
} from "./services/destiny-services";
import { FETCH_PLAYER_PROFILE, FETCH_PROFILE_CHARACTERS } from "./store/constants";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  align-items: center;
  margin-left: 100px;
`;

const Input = styled.input`
  width: 300px;
  height: 40px;
  font-size: 24px;
`;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playerSearch: 'videoflux',
      searchHistory: [],
      player: {
        displayName: ''
      }
    }
  };

  // Filter: 0 - All
  // Group Type: 0 - General, 1 - Clan

  handlePlayerSearch = ({ target}) => {
    this.setState({
      playerSearch: target.value
    });
  };

  searchDestinyPlayer = async (e) => {
    e.preventDefault();
    const { searchPlayer } = this.props;
    console.log('searchPlaya', searchPlayer);

    const { playerSearch } = this.state;
    const playerProfile = await searchPlayer({ displayName: playerSearch, membershipType: -1 });

    // console.log('playerProfile', playerProfile);
    // this.setState({
    //   searchHistory: [playerSearch, ...this.state.searchHistory],
    //   player: playerProfile
    // });

    // this.getCharactersClan().then((data) => console.log('clan', data));
    // this.getCharactersRaidReport(); // .then((data) => console.log('raid report'), data);
  };

  getCharactersClan = async () => {
    const clan = await fetchGroupsForMembers({ filter: 0, groupType: 1, ...this.state.player});
    this.setState({ player: { clan: clan[0], ...this.state.player } });
    return clan[0];
  };

  getCharactersRaidReport = async () => {
    const { userInfo: { membershipId, membershipType } } = this.state.player;
    const pathParams = {membershipType, membershipId, characterId: '2305843009261142123'};
    const queryParams = { page: 0, mode: 'raid', count: 250};
    const raidReport = await fetchActivityHistory(pathParams, queryParams);
    console.log('raid report', raidReport);
  };

  render() {
    baseStyles();

    const { playerSearch, player } = this.state;

    return (
      <Wrapper>
        <form onSubmit={(e) => this.searchDestinyPlayer(e)}>
          <Input value={playerSearch} onChange={this.handlePlayerSearch} />
        </form>
        <div style={{ marginLeft: 50 }}>
          {
            player.iconPath &&
              <div style={{ width: 100, height: 100 }}>
                <img src={`${destinyBaseURL}${player.iconPath}`}/>
              </div>
          }
        </div>
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    player: state.player
  }
};

const mapDispatchToProps = dispatch => {
  return {
    searchPlayer: pathParams => dispatch({type: FETCH_PLAYER_PROFILE, data: pathParams})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);

/*
          {
            player.displayName ? (
              <div>
                <p>{player.displayName}</p>
                <br/>
                <p>Versions Owned: {player.versionsOwned}</p><br />
                <p>Last Played: {player.dateLastPlayed}</p><br />
                <h2>Characters:</h2>
                <ul>
                  { player.characterIds.map((id, idx) => <li key={`${idx}-${id}`}>{id}</li>) }
                </ul>
              </div>
            ) : <p>Search for a player</p>
          }
 */