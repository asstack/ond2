import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import shortid from 'shortid';

import baseStyles from './base-styles';
import { FETCH_PLAYER_PROFILE, LOAD_PUBLIC_MILESTONE_DATA, FETCH_PCGR } from "./store/constants";
import RaidWeekViewer from './components/RaidWeekViewer';
import RaidStats from './components/RaidStats';
import { fetchPostGameCarnageReport } from "./services/destiny-services";

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
  width: 100%;
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
      stats: []
    }
  };

  componentDidMount() {
    const { loadPublicMilestoneData } = this.props;
    loadPublicMilestoneData();
  }

  handlePlayerSearch = ({ target}) => {
    this.setState({
      playerSearch: target.value
    });
  };

  showStats = (stats) => {
    this.setState({
      stats: stats
    });
  };

  clearStats = () => {
    this.setState({
      stats: []
    })
  };

  searchDestinyPlayer = (e) => {
    e.preventDefault();
    const { playerSearch } = this.state;
    const { searchPlayer } = this.props;
    searchPlayer({ displayName: playerSearch, membershipType: -1 });
  };

  fetchPGCR = (instanceId) => {
    const { fetchPostGameCarnageReport } = this.props;
    fetchPostGameCarnageReport(instanceId)
  };

  render() {
    baseStyles();

    const { playerSearch, stats } = this.state;
    const { playerProfile, raidHistory } = this.props;
    const statEntries = Object.entries(stats);

    return (
      <AppWrapper>
        <PlayerSearchSection>
          <form onSubmit={(e) => this.searchDestinyPlayer(e)}>
            <label>Gamer Tag</label>
            <Input value={playerSearch} onChange={this.handlePlayerSearch} />
          </form>
          <h4>EOW: </h4><p>Normal(#) Prestige(#)</p>
          <br />
          <h4>Leviathan: </h4><p>Normal(#) Prestige(#)</p>
        </PlayerSearchSection>
        <RaidReportSection>
          <RaidWeekViewer
            handleFetchPGCR={this.fetchPGCR}
            handleShowStats={this.showStats}
            handleClearStats={this.clearStats}
            raidHistory={raidHistory}
          />
        </RaidReportSection>
        {!!statEntries.length &&
          <RaidStats>
            <button onClick={this.clearStats}>Clear</button>
            <ul>
              {statEntries.map((entry) => {
                const [name, stat] = entry;
                return <li key={shortid.generate()}>{name} : {stat}</li>
              })
              }
            </ul>
          </RaidStats>
        }
      </AppWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    playerProfile: state.playerProfile,
    raidHistory: state.raidHistory
  }
};

const mapDispatchToProps = dispatch => {
  return {
    searchPlayer: pathParams => dispatch({type: FETCH_PLAYER_PROFILE, data: pathParams}),
    loadPublicMilestoneData: () => dispatch({type: LOAD_PUBLIC_MILESTONE_DATA}),
    fetchPostGameCarnageReport: pathParams => dispatch({type: FETCH_PCGR, data: pathParams})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);