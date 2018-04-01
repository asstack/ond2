import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import shortId from 'shortid';

import { Search, Icon } from 'semantic-ui-react';
import { PLATFORM_ICONS, PLATFORM_MODES } from "../store/constants";

const PlayerSearchWrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const PlayerSearchSection = styled.div`
  margin: 30px 0 30px 0;
  
  @media only screen and (min-width: 340px) and (max-width: 400px) {
    margin: 30px 0 15px 0;
  }
  
  @media only screen and (max-width: 750px) {
    margin: 30px 0 15px 0;
  }
  
  @media only screen and (min-width: 750px) and (max-width: 1250px) {
    margin: 30px 0 15px 0;
  }
  
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
        width: 225px !important;
      }
      
      
      @media only screen and (min-width: 400px) and (max-width: 750px) {
        width: 375px !important;
      }
      
      @media only screen and (min-width: 750px) and (max-width: 1250px) {
        width: 650px !important;
      }
    }
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
  
  @media only screen and (min-width: 340px) and (max-width: 400px) {
    width: 225px;
  }
  
  
  @media only screen and (min-width: 400px) and (max-width: 750px) {
    width: 375px;
  }
  
  @media only screen and (min-width: 750px) and (max-width: 1250px) {
    width: 650px;
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
            />
            <Icon
              name="search"
              fitted={false}
              size="large"
              onClick={(e) => { e.preventDefault(); return handlePlayerSearch(playerSearch) }} />
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