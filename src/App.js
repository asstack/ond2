import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${(props) => props.loading ? "div { display: none; }" : ''}
`;

class App extends Component {

  constructor(props) {
    super(props);
  }

  fetchPGCR = (instanceId) => {
    const { fetchPostGameCarnageReport } = this.props;
    fetchPostGameCarnageReport(instanceId)
  };

  render() {
    baseStyles();

    const { pgcr, clearPostGameCarnageReport, loading } = this.props;

    return (
      <Router>
        <AppWrapper>
          { loading && <DestinyLoader /> }
          {!pgcr &&
            <PlayerInfoWrapper loading={loading || pgcr}>
              <PlayerSearchContainer
                handleClearPGCR={() => clearPostGameCarnageReport()}
                handleFetchPGCR={this.fetchPGCR}
                {...this.props}
              />
            </PlayerInfoWrapper>
          }
          { pgcr &&
            <Route path="/destiny/pgcr/:instanceId" render={({...rest}) => (
              <PostGameCarnageReportContainer
                {...rest}
                pgcr={pgcr}
                handleDeepLink={this.fetchPGCR}
                handleClearPGCR={() => clearPostGameCarnageReport()}
              />
            )}/>
          }
        </AppWrapper>
      </Router>
    );
  }
}

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