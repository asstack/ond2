import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import AutoSuggest from 'react-autosuggest';

const PlayerSearchWrapper = styled.section`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const PlayerSearchSection = styled.div`
  margin: 75px 0 30px 0;
  
  & input {
    width: 300px;
    height: 40px;
    font-size: 24px;
    border-radius: 3px;
    padding: 5px;
  }

`;

const Input = styled.input`
  width: 300px;
  height: 40px;
  font-size: 24px;
  border-radius: 3px;
  padding: 5px;
`;

//function renderSuggestion(suggestion) {
//  return (
//    <div style={{ width: '300px', height: '50px' }}>{suggestion}</div>
//  );
//}
//
//const getSuggestionValue = suggestion => suggestion;

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

    //const inputProps = {
    //  placeholder: 'Gamer Tag',
    //  value: playerSearch,
    //  onChange: this.handleOnChange
    //};

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

export default PlayerSearch;

/*
          <form onSubmit={(e) => { e.preventDefault(); return this.props.handlePlayerSearch(playerSearch) }}>
            <AutoSuggest
              suggestions={suggestions}
              getSuggestionValue={getSuggestionValue}
              onSuggestionSelected={this.onSuggestionSelected}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
            />
          </form>
            handleOnChange = (event, { newValue, method }) => {
    if(method === 'type') {
      this.handlePlayerInput(newValue)
    }
    else if(method === 'click') {
      //this.props.selectGamerTag(newValue);
    }
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex }) => {
    //this.selectGamerTag(suggestion);
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.props.gamerTagSuggestions
    })
  };

  onSuggestionsClearRequested = (...props) => {
    this.setState({
      suggestions: []
    })
  };
 */