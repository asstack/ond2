import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, withRouter, Route } from 'react-router-dom';
import styled from 'styled-components';

import baseStyles from './base-styles';
import { FETCH_PGCR, SET_PGCR } from "./store/constants";

import Landing from './containers/Landing';
import PlayerDataView from './containers/PlayerDataView';
import PostGameCarnageReportContainer from './containers/PostGameCarnageReport';
import DestinyLoader from './components/DestinyLoader/DestinyLoader';
import * as consts from "./store/constants";

const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
  background-color: #f4f4f4;
`;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      internalRouting: false
    }
  }

  searchByGamerTag = (gamerTag) => {
    const { searchPlayer, history } = this.props;
    searchPlayer({ displayName: gamerTag, membershipType: -1 });
  };

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

        <Route exact path="/destiny" render={data => (
          <Landing loading={loading} {...data} />
        )} />

         <Route path="/destiny/player/:playerId" render={(data) => (
           <PlayerDataView handlePlayerSearch={this.searchByGamerTag} {...this.props} {...data} />
         )}/>

        <Route path="/destiny/pgcr/:instanceId" render={({...rest}) => (
          <PostGameCarnageReportContainer
            {...rest}
            pgcr={pgcr}
            handleFetchPGCR={this.fetchPGCR}
            handleClearPGCR={() => clearPostGameCarnageReport()}
          />
        )}/>
      </AppWrapper>
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
    clearPostGameCarnageReport: () => dispatch({ type: SET_PGCR, data: false}),
    searchPlayer: pathParams => dispatch({ type: consts.FETCH_PLAYER_PROFILE, data: pathParams })
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));