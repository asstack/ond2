import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import shortId from 'shortid';

import { Search, Icon } from 'semantic-ui-react';
import { PLATFORM_ICONS, PLATFORM_MODES } from "../store/constants";

const PlayerSearchSection = styled.div`

  width: 100%;
  margin: 30px 0;
  
  &&& {
  
    form {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      
      i {
        margin-left: -45px;
        z-index: 1;
      }
    }

  .playerSearch {
    width: 100%;
    max-width: 756px;
    
    i {
      margin-right: 30px;
    }

    .input {
      width: 100%;
    }
    
    input {
      width: 100%;
      max-width: 756px;
      height: 68px;
      border-radius: 34px;
      border: solid 2px black;
      padding: 32px;
      
      font-size: 20px;
      font-family: Montserrat sans-serif;
      font-weight: 500;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      text-align: left;
      color: #000000;
    }
      
      @media only screen and (max-width: 430px) {
        margin-left: 10px;
        width: 300px;
      }
      
      @media only screen and (min-width: 430px) and (max-width: 575px) {
        width: 425px;
      }
      
      @media only screen and (min-width: 575px) and (max-width: 750px) {
        width: 525px;
      }
      
      @media only screen and (min-width: 750px) and (max-width: 1250px) {
        width: 650px;
      }
    }
  }
`;

class PlayerSearch extends Component {

  static propTypes = {
    playerId: PropTypes.string,
    handlePlayerSearch: PropTypes.func.isRequired
  };

  state = {
    playerSearch: this.props.playerId || '',
  };

  componentDidMount() {
    this.focusSearchElement();
  }

  componentWillReceiveProps(nextProps) {
    this.props.playerId !== nextProps.playerId && this.setState({ playerSearch: nextProps.playerId });
  }

  focusSearchElement = () => {
    this.playerInput.childNodes[0][0].focus();
  };

  clearSearch = () => {
    this.setState( {
      playerSearch: ''
    })
  };

  handlePlayerInput = (e) => {
    const parsedSearch = e.target.value.replace('#', '%23');

    this.setState({
      playerSearch: parsedSearch,
    });
  };

  handleResultSelect = (event, { result }) => {
    this.props.selectGamerTag(result);
  };

  render() {
    const { playerSearch } = this.state;
    const { handlePlayerSearch, gamerTagOptions } = this.props;

    const openSearchSelection = gamerTagOptions ? gamerTagOptions.length > 0 : false;

    const options = !openSearchSelection
      ? []
      : gamerTagOptions.reduce((accum, curr, idx) => {
          accum[idx] = {
            title: curr.displayName,
            description: PLATFORM_MODES[curr.membershipType],
            image: PLATFORM_ICONS[curr.membershipType],
            key: curr.membershipId
          };
          return accum;
    }, []);

    const playerSearchDisplay = playerSearch.replace('%23', '#');

    return(
      <PlayerSearchSection innerRef={(input) => { this.playerInput = input}}>
        <form onSubmit={(e) => { e.preventDefault(); return handlePlayerSearch(playerSearch) }}>
          <Search
            icon=""
            className="playerSearch"
            placeholder="Gamer Tag"
            noResultsMessage="Gamer Tag not found"
            results={options}
            value={playerSearchDisplay}
            onSearchChange={this.handlePlayerInput}
            open={openSearchSelection}
            onResultSelect={this.handleResultSelect}
            onMouseDown={this.clearSearch}
          />
          <Icon
            name="search"
            size="large"
            fitted={false}
            onClick={() => playerSearch === '' ? null : handlePlayerSearch(playerSearch)} />
        </form>
      </PlayerSearchSection>
    )
  }
}

export default PlayerSearch;