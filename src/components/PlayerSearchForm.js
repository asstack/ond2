import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

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

const Input = styled.input`
  width: 300px;
  height: 40px;
  font-size: 24px;
  margin-left: 10px;
  border-radius: 3px;
  padding: 5px;
`;

class PlayerSearchContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerSearch: this.props.playerId || '',
    }
  }

  static propTypes = {
    playerId: PropTypes.string,
    handlePlayerSearch: PropTypes.func.isRequired
  };

  handlePlayerInput = ({ target}) => {
    this.setState({
      playerSearch: target.value,
    });
  };

  render() {
    const { playerSearch } = this.state;
    const { handlePlayerSearch } = this.props;

    return(
      <PlayerSearchWrapper>
        <PlayerSearchSection>
          <form onSubmit={(e) => { e.preventDefault(); return handlePlayerSearch(playerSearch) }}>
            <Input placeholder="Gamer Tag" value={playerSearch} onChange={this.handlePlayerInput} />
          </form>
        </PlayerSearchSection>
      </PlayerSearchWrapper>
    )
  }
}

export default PlayerSearchContainer;