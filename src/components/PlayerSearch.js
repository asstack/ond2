import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import shortId from 'shortid';

import { Search, Icon } from 'semantic-ui-react';
import { PLATFORM_ICONS, PLATFORM_MODES } from "../store/constants";

const PlayerSearchWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px 0;
`;

const PlayerSearchSection = styled.div`
  
  form {
    display: flex;
    flex-direction: row;
    align-items: center;
    
    i {
      margin-left: -60px;
      z-index: 1;
     
    }
  }

  .playerSearch {
    i {
      margin-right: 30px !important;
    }
    
    input {
      width: 756px !important;
      height: 68px !important;
      border-radius: 34px !important;
      border solid 2px black !important;
      font-size: 20px !important;
      padding: 32px !important;
      
      font-family: Montserrat !important;
      font-size: 20px !important;
      font-weight: 500 !important;
      font-style: normal !important;
      font-stretch: normal !important;
      line-height: normal !important;
      letter-spacing: normal !important;
      text-align: left !important;
      color: #000000 !important;
      
      @media only screen and (min-width: 340px) and (max-width: 400px) {
        width: 300px !important;
      }
      
      @media only screen and (min-width: 400px) and (max-width: 574px) {
        width: 375px !important;
      }
      
      @media only screen and (min-width: 575px) and (max-width: 750px) {
        width: 525px !important;
      }
      
      @media only screen and (min-width: 750px) and (max-width: 1250px) {
        width: 650px !important;
      }
    }
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
    //this.playerInput.focus();
  }

  componentWillReceiveProps(nextProps) {
    if(this.props.playerId !== nextProps.playerId) {
      this.setState({ playerSearch: nextProps.playerId });
    }
  }

  handlePlayerInput = (e) => {
    const transformedSearch = e.target.value.replace('#', '%23');

    this.setState({
      playerSearch: transformedSearch,
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
      <PlayerSearchWrapper>
        <PlayerSearchSection>
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
              onMouseDown={() => this.handlePlayerInput}
            />
            <Icon
              name="search"
              fitted={false}
              size="large"
              onClick={(e) => { e.preventDefault(); return handlePlayerSearch('') }} />
          </form>
        </PlayerSearchSection>
      </PlayerSearchWrapper>
    )
  }
}

export default PlayerSearch;

/*
  <Input
    innerRef={(input) => { this.playerInput = input; }}
    placeholder="Gamer Tag"
    value={playerSearch}
    onChange={this.handlePlayerInput}
  />
 */