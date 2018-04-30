import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, withRouter, Route } from 'react-router-dom';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';

import baseStyles from './base-styles';
import { FETCH_PGCR, SET_PGCR, SET_LOADING } from "./store/constants";

import Landing from './containers/Landing';
import PlayerDataView from './containers/PlayerDataView';

import SideMenu from './components/SideMenu';
import PostGameCarnageReportContainer from './containers/PostGameCarnageReport';
import LogoLoader from './components/LogoLoader';
import OND2Logo from './components/OND2Logo';
import * as consts from "./store/constants";

const AppWrapper = styled.div`
  min-width: 100vw;
  min-height: 100vh;
  height: 90%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f4f4f4;
`;

const MenuToggleWrapper = styled.div`
  width: 50px;
  height: 50px;
  position: fixed;
  top: 25px;
  left: 10%;
`;

class App extends Component {

  constructor() {
    super();

    this.state = {
      internalRouting: false,
      showSideMenu: false
    }
  }

  searchByGamerTag = (gamerTag) => {
    const { searchPlayer } = this.props;
    searchPlayer({ displayName: gamerTag, membershipType: -1 });
  };

  fetchPGCR = (instanceId) => {
    const { fetchPostGameCarnageReport } = this.props;
    fetchPostGameCarnageReport(instanceId)
  };

  toggleSideMenu = () => this.setState({ showSideMenu: !this.state.showSideMenu });

  render() {
    baseStyles();

    const { showSideMenu } = this.state;
    const { pgcr, clearPostGameCarnageReport, loading, clearLoader } = this.props;

    return (
      <AppWrapper>
        <SideMenu toggle={this.toggleSideMenu} visible={showSideMenu}>
          <MenuToggleWrapper onClick={() => this.toggleSideMenu() }>
           <OND2Logo />
          </MenuToggleWrapper>
          { loading && <LogoLoader /> }

          <Route exact path="/" render={data => (
            <Landing loading={loading} {...data} />
          )} />

           <Route path="/player/:playerId" render={(data) => (
             <PlayerDataView handlePlayerSearch={this.searchByGamerTag} {...this.props} {...data} />
           )}/>

          <Route path="/pgcr/:instanceId" render={({...rest}) => (
            <PostGameCarnageReportContainer
              {...rest}
              pgcr={pgcr}
              handleFetchPGCR={this.fetchPGCR}
              handleClearPGCR={() => clearPostGameCarnageReport()}
              handleClearLoader={() => clearLoader() }
            />
          )}/>
        </SideMenu>
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
    searchPlayer: pathParams => dispatch({ type: consts.FETCH_PLAYER_PROFILE, data: pathParams }),
    clearLoader: () => dispatch({ type: SET_LOADING, data: false })
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));