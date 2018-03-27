import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';

import PlayerSearchForm from '../components/PlayerSearch';

const LandingWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${(props) => props.loading ? "div { display: none; }" : ''}
`;

class Landing extends Component {

  state = {
    playerId: this.props.match.params.playerId || ''
  };

  playerSearch = (name) => {
    const { history } = this.props;
    this.setState({ playerId: name });
    history.push(`/player/${name}`, { gamerTag: name });
  };

  render() {
    const { playerId } = this.state;
    return (
      <LandingWrapper loading={this.props.loading}>
        <PlayerSearchForm playerId={playerId} handlePlayerSearch={this.playerSearch}/>
      </LandingWrapper>
    )
  }
}

export default withRouter(Landing);