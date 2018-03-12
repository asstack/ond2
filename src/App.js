import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import baseStyles from './base-styles';

import PlayerSearchContainer from './containers/PlayerSearchContainer/PlayerSearchContainer';
import PostGameCarnageReportContainer from './containers/PostGameCarnageReportContainer/PostGameCarnageReportContainer';
import DestinyLoader from './components/DestinyLoader/DestinyLoader';
import { FETCH_PGCR, SET_PGCR } from "./store/constants";

const AppWrapper = styled.div`

  width: 100%;
  height: 100%;
  align-items: center;
`;

const PlayerInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${(props) => props.loading ? "div { display: none; }" : ''}
`;

class App extends Component {

  fetchPGCR = (instanceId) => {
    const { fetchPostGameCarnageReport } = this.props;
    fetchPostGameCarnageReport(instanceId)
  };

  render() {
    baseStyles();

    const { pgcr, clearPostGameCarnageReport, loading } = this.props;

    return (
      <AppWrapper>
        { loading && <DestinyLoader /> }
        <PlayerInfoWrapper loading={loading}>
          <PostGameCarnageReportContainer pgcr={pgcr} handleClearPGCR={() => clearPostGameCarnageReport()} />
          <PlayerSearchContainer
            handleClearPGCR={() => clearPostGameCarnageReport()}
            handleFetchPGCR={this.fetchPGCR}
            {...this.props}
           />
        </PlayerInfoWrapper>
      </AppWrapper>
    );
  }
}

/*

 */

const mapStateToProps = state => {
  return {
    pgcr: state.postGameCarnageReport,
    loading: state.loading
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchPostGameCarnageReport: pathParams => dispatch({type: FETCH_PGCR, data: pathParams}),
    clearPostGameCarnageReport: () => dispatch({ type: SET_PGCR, data: false})
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(App);