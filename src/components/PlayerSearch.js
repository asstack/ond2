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

`;

const Input = styled.input`
  width: 756px;
  height: 68px;
  border-radius: 34px;
  border solid 2px black;
  font-size: 20px;
  padding: 32px;
  
  font-family: Montserrat;
  font-size: 20px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #000000;
`;

class PlayerSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerSearch: props.playerId || '',
    }
  }

  static propTypes = {
    playerId: PropTypes.string,
    handlePlayerSearch: PropTypes.func.isRequired
  };

  componentDidMount() {
    this.playerInput.focus();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.playerId !== nextProps.playerId) {
      this.setState({ playerSearch: nextProps.playerId });
    }
  }

  handlePlayerInput = ({ target }) => {
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
            <Input
              innerRef={(input) => { this.playerInput = input; }}
              placeholder="Gamer Tag"
              value={playerSearch}
              onChange={this.handlePlayerInput}
            />
          </form>
        </PlayerSearchSection>
      </PlayerSearchWrapper>
    )
  }
}

export default PlayerSearch;