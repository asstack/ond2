import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';
import { Segment, Container, List } from 'semantic-ui-react';
import styled from 'styled-components';

import baseStyles from './base-styles';
import { FETCH_PGCR, SET_PGCR, SET_LOADING, CONTACT_REDDIT } from "./store/constants";

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
  z-index: 5;
  
  @media only screen and (max-width: 400px) {
    left: 1%;
  }

  @media only screen and (min-width: 400px) and (max-width: 574px) {
    left: 1%;
  }
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
    const { pgcr, newPlayer, clearPostGameCarnageReport, loading, clearLoader } = this.props;

    return (
      <AppWrapper>
        <SideMenu toggle={this.toggleSideMenu} visible={showSideMenu}>
          <MenuToggleWrapper onClick={() => this.toggleSideMenu() }>
           <OND2Logo />
          </MenuToggleWrapper>
          { loading && <LogoLoader newPlayer={newPlayer} /> }

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
        <Segment vertical style={{ width: '100%', padding: '2em 0em' }}>
          <Container textAlign='center'>
            <List horizontal divided link small="true">
              <List.Item as='a' href={CONTACT_REDDIT}>Contact Us</List.Item>
              <List.Item as='a' href='/faq'>FAQ</List.Item>
              <List.Item as='a' href='https://www.reddit.com/user/videoflux'>Concept and UI by Videoflux</List.Item>
              <List.Item as='a' href='http://www.w-richardson.com'>Developed by <b>William Richardson</b></List.Item>
            </List>
          </Container>
        </Segment>
      </AppWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    pgcr: state.postGameCarnageReport,
    loading: state.loading,
    newPlayer: state.playerProfile.newPlayer
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