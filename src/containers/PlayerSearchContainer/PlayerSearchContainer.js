import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import shortid from 'shortid';

import RaidWeekViewer from '../../components/RaidWeekViewer';
import RaidStats from '../../components/RaidStats';
import { FETCH_PGCR, FETCH_PLAYER_PROFILE } from "../../store/constants";

const PlayerSearchWrapper = styled.section`
  display: ${({ pgcr }) => pgcr ? 'none' : 'flex' };
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
`;

class PlayerSearchContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerSearch: '',
    }
  }

  handlePlayerInput = ({ target}) => {
    this.setState({
      playerSearch: target.value
    });
  };

  searchDestinyPlayer = (e) => {
    e.preventDefault();
    const { playerSearch } = this.state;
    const { searchPlayer } = this.props;
    searchPlayer({ displayName: playerSearch.replace(' ', '%20'), membershipType: -1 });
  };

  render() {
    const { playerSearch } = this.state;
    const { raidHistory, handleFetchPGCR, handleClearPGCR, pgcr } = this.props;

    return(
      <PlayerSearchWrapper pgcr={pgcr}>
        <PlayerSearchSection>
          <form onSubmit={(e) => this.searchDestinyPlayer(e)}>
            <label>Gamer Tag</label>
            <Input value={playerSearch} onChange={this.handlePlayerInput} />
          </form>
          <h4>EOW: </h4><p>Normal(#) Prestige(#)</p>
          <br />
          <h4>Leviathan: </h4><p>Normal(#) Prestige(#)</p>
        </PlayerSearchSection>
        <RaidReportSection>
          <RaidWeekViewer
            handleClearPGCR={handleClearPGCR}
            handleFetchPGCR={handleFetchPGCR}
            raidHistory={raidHistory}
          />
        </RaidReportSection>
      </PlayerSearchWrapper>
    )
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
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(PlayerSearchContainer);