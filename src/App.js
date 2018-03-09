import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import baseStyles from './base-styles';

import PlayerSearchContainer from './containers/PlayerSearchContainer/PlayerSearchContainer';
import PostGameCarnageReportContainer from './containers/PostGameCarnageReportContainer/PostGameCarnageReportContainer';
import DestinyLoader from './components/DestinyLoader/DestinyLoader';
import { FETCH_PGCR, SET_PGCR } from "./store/constants";

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
`;

class App extends Component {

  fetchPGCR = (instanceId) => {
    const { fetchPostGameCarnageReport } = this.props;
    fetchPostGameCarnageReport(instanceId)
  };

  render() {
    baseStyles();

    const { pgcr, clearPostGameCarnageReport } = this.props;

    return (
      <AppWrapper>
        <PostGameCarnageReportContainer pgcr={pgcr} handleClearPGCR={() => clearPostGameCarnageReport()} />
        <PlayerSearchContainer
          handleClearPGCR={() => clearPostGameCarnageReport()}
          handleFetchPGCR={this.fetchPGCR}
          {...this.props}
          />

      </AppWrapper>
    );
  }
}

/*
<DestinyLoader />
 */

const mapStateToProps = state => {
  return {
    pgcr: state.postGameCarnageReport
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchPostGameCarnageReport: pathParams => dispatch({type: FETCH_PGCR, data: pathParams}),
    clearPostGameCarnageReport: () => dispatch({ type: SET_PGCR, data: false})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);