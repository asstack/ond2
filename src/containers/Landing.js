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

const HeroLogo = styled.img`
  width: 40%;
  margin: 50px 0;
  
  @media only screen and (min-width: 340px) and (max-width: 750px) {
    margin-top: 30px;
  }
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
        <HeroLogo src="/assets/ond2-logo.png"/>
        <PlayerSearchForm playerId={playerId} handlePlayerSearch={this.playerSearch}/>
      </LandingWrapper>
    )
  }
}

export default withRouter(Landing);