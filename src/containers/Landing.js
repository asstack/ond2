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
  
  @media only screen and (max-width: 400px) {
    width: 60%;
    margin: 60px 0 10px 0;
  }
  
  @media only screen and (min-width: 400px) and (max-width: 900px) {
    width: 60%;
    margin: 50px 0 10px 0;
  }
`;

class Landing extends Component {

  state = {
    playerId: this.props.match.params.playerId || ''
  };

  componentDidMount() {
    this.props.clearErrorState();
    this.props.clearLoader();

  }

  playerSearch = (name) => {
    const { history } = this.props;
    this.setState({ playerId: name });
    history.push(`/player/${name}`, { gamerTag: name });
  };

  render() {
    const { playerId } = this.state;
    return (
      <LandingWrapper loading={this.props.loading}>
        <HeroLogo srcSet="/assets/ond2-logo-small.png 401w, /assets/ond2-logo.png 1281w" />
        <PlayerSearchForm playerId={playerId} handlePlayerSearch={this.playerSearch}/>
      </LandingWrapper>
    )
  }
}

export default withRouter(Landing);