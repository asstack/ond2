import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import baseStyles, { AppWrapper, PlayerInfoWrapper} from './base-styles';
import { FETCH_PGCR, SET_PGCR } from "./store/constants";

import PlayerDataView from './containers/playerDataView/PlayerDataView';
import PostGameCarnageReportContainer from './containers/pgcrView/PGCR_View';
import DestinyLoader from './components/DestinyLoader/DestinyLoader';


class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      internalRouting: false
    }
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
          <PlayerInfoWrapper loading={loading || pgcr}>
            <PlayerDataView
              handleClearPGCR={() => clearPostGameCarnageReport()}
              handleFetchPGCR={this.fetchPGCR}
              {...this.props}
            />
          </PlayerInfoWrapper>
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