import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import baseStyles from './base-styles';
import { destinyBaseURL } from "./services/destiny-endpoints";
import { FETCH_PLAYER_PROFILE, FETCH_PROFILE_CHARACTERS } from "./store/constants";
import RaidWeekViewer from './components/RaidWeekViewer';

const AppWrapper = styled.div`
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
`;

const Input = styled.input`
  width: 300px;
  height: 40px;
  font-size: 24px;
  margin-left: 10px;
`;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      playerSearch: 'videoflux',
      searchHistory: [],
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

  render() {
    baseStyles();

    const { playerSearch } = this.state;
    const { playerProfile, raidHistory } = this.props;

    return (
      <AppWrapper>
        <PlayerSearchSection>
          <form onSubmit={(e) => this.searchDestinyPlayer(e)}>
            <label>Gamer Tag</label>
            <Input value={playerSearch} onChange={this.handlePlayerSearch} />
          </form>
          <h4>EOW: </h4><p>Normal(22) Prestige(50)</p>
          <br />
          <h4>Leviathan: </h4><p>Normal(30) Prestige(43)</p>
        </PlayerSearchSection>
        <RaidReportSection>
          <RaidWeekViewer raidHistory={raidHistory} />
        </RaidReportSection>
      </AppWrapper>
    );
  }
}

const mapStateToProps = state => {
  console.log('state', state);
  return {
    playerProfile: state.playerProfile,
    raidHistory: state.raidHistory
  }
};

const mapDispatchToProps = dispatch => {
  return {
    searchPlayer: pathParams => dispatch({type: FETCH_PLAYER_PROFILE, data: pathParams})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);