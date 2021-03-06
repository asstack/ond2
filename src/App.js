import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Switch } from 'react-router-dom';
import { Segment, Container, List } from 'semantic-ui-react';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

import baseStyles from './base-styles';
import {
  FETCH_PGCR,
  SET_PGCR,
  SET_LOADING,
  CONTACT_REDDIT,
  SET_SITE_ERROR,
  SET_UPDATE_PROMPT, SET_ID_HISTORY
} from "./store/constants";

import Landing from './containers/Landing';
import UpdatePrompt from './components/UpdatePrompt';
import PlayerDataView from './containers/PlayerDataView';
import ErrorMessage from './components/ErrorMessage';
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
  overflow-y: scroll;
 -webkit-overflow-scrolling: touch;
`;

const MenuToggleWrapper = styled.div`
  width: 50px;
  height: 50px;
  position: absolute;
  top: 25px;
  left: 10%;
  z-index: 99999999;
  
  @media only screen and (max-width: 875px) {
    left: 5%;
  }
  
  @media only screen and (min-width: 875px) and (max-width: 1100px) {
    left: 5%;
  }
`;

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      internalRouting: false,
      showSideMenu: false,
      resize: true
    };

    this.previousLocation = this.props.location;
  }

  searchByGamerTag = (data) => {
    const { gamerTag, event, membershipId } = data;
    const { searchPlayer } = this.props;
    searchPlayer({ displayName: gamerTag, membershipType: -1, event, membershipId });
  };

  pullByMembershipId = (membershipId) => {
    const { searchPlayer } = this.props;
    searchPlayer({}, membershipId);
  };

  fetchPGCR = (instanceId) => {
    const { fetchPostGameCarnageReport } = this.props;
    fetchPostGameCarnageReport(instanceId)
  };

  toggleSideMenu = () => this.setState({ showSideMenu: !this.state.showSideMenu });

  render() {
    baseStyles();

    const { showSideMenu } = this.state;
    const {
      pgcr, siteError, newPlayer, clearErrorState,
      clearPostGameCarnageReport, loading, clearLoader,
      showUpdatePrompt, location, quickStats, playerProfile, setPlatform
    } = this.props;

    const handleUpdatePromptClicked = () => {
      this.props.clearUpdatePrompt();
      localStorage.setItem('userUpdate', 'true');
      window.location.reload(true);
    };

    const isModal = !!(
      location.state &&
      location.state.modal &&
      this.previousLocation !== location
    ); // Not initial render

    // const renderFooter = !isModal && location.pathname.indexOf('pgcr') < 0;

    return (
      <AppWrapper>
        { siteError && <ErrorMessage /> }

        <SideMenu toggle={this.toggleSideMenu} visible={showSideMenu}>
          {(!pgcr || !isMobile) &&
            <MenuToggleWrapper onClick={() => this.toggleSideMenu()}>
              <OND2Logo loading={loading} />
            </MenuToggleWrapper>
          }

          <LogoLoader playerProfile={playerProfile} newPlayer={newPlayer} quickStats={quickStats} loading={false} />

          <Route exact path="/" render={data => (
            <Landing loading={loading} clearErrorState={clearErrorState} clearLoader={clearLoader} {...data} />
          )} />

          <Route path="/player/:playerId" render={(data) => (
            <PlayerDataView
              handlePlayerSearch={this.searchByGamerTag}
              handleBackNav={this.pullByMembershipId}
              setPlatform={setPlatform}
              clearLoader={clearLoader}
              clearErrorState={clearErrorState}
              {...this.props}
              {...data}
            />
          )}/>

          <Route path="/pgcr/:instanceId" render={({...rest}) => (
            <PostGameCarnageReportContainer
            {...rest}
            isModal={isModal}
            pgcr={pgcr}
            handleFetchPGCR={this.fetchPGCR}
            handleClearPGCR={() => clearPostGameCarnageReport()}
            handleClearLoader={() => clearLoader()}
            clearErrorState={clearErrorState}
          />
          )}/>

        </SideMenu>
        {(!pgcr && !isMobile) &&
          <Segment vertical style={{width: '100%', zIndex: 999}}>
            <Container textAlign='center'>
              <List horizontal divided link small="true">
                <List.Item as='a' href={CONTACT_REDDIT}>Contact Us</List.Item>
                <List.Item as='a' href='/faq'>FAQ</List.Item>
                <List.Item as='a' href='https://www.reddit.com/user/videoflux'>Concept and UI by Videoflux</List.Item>
                <List.Item as='a' href='http://www.w-richardson.com'>Developed by <b>William Richardson</b></List.Item>
              </List>
            </Container>
          </Segment>
        }
        { showUpdatePrompt && <UpdatePrompt clearUpdatePrompt={handleUpdatePromptClicked} showUpdatePrompt={showUpdatePrompt} /> }
      </AppWrapper>
    );
  }
}

const mapStateToProps = state => {
  return {
    playerProfile: state.playerProfile,
    pgcr: state.postGameCarnageReport,
    loading: state.loading,
    newPlayer: state.newPlayer,
    siteError: state.siteError,
    showUpdatePrompt: state.showUpdatePrompt,
    quickStats: state.quickStats,
    platform: state.platform
  }
};

const mapDispatchToProps = dispatch => {
  return {
    fetchPostGameCarnageReport: pathParams => dispatch({type: FETCH_PGCR, data: pathParams}),
    clearPostGameCarnageReport: () => dispatch({ type: SET_PGCR, data: false}),
    searchPlayer: pathParams => dispatch({ type: consts.FETCH_PLAYER_PROFILE, data: pathParams }),
    clearLoader: () => dispatch({ type: SET_LOADING, data: false }),
    clearErrorState: () => dispatch({ type: SET_SITE_ERROR, data: false }),
    clearUpdatePrompt: () => dispatch({ type: SET_UPDATE_PROMPT, data: false }),
    setPlatform: (platform) => dispatch({ type: SET_ID_HISTORY, data: platform })
  }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));