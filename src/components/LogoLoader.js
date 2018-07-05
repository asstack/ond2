import React from 'react';
import styled from 'styled-components';
import Modal from 'react-responsive-modal';
import { Header, Image, Item } from 'semantic-ui-react';
import OND2Logo from './OND2Logo';

const LoaderWrapper = styled.div`

  .require-stats {
    display: none;
  }
  
  ${({ newPlayer }) => {
    return newPlayer ? '' : `
      width: 100%;
        height: 100%;
        
        position: fixed;
        top: 0;
        left: 0;
        
        display: flex;
        flex-direction: column;
        justify-content: start;
        align-items: center;    
    `
  }}
  
  svg {
    position: absolute;
    top: 25%;
    left: calc(50% - 100px);
    margin-top: 50px;
    fill: black;
    width: 200px;
    height: 100px;
    animation: spin 1.5s ease infinite
  }
  
  @keyframes spin {
    0% {transform: rotateY(0deg)}
    100% {transform: rotateY(360deg)
  }
`;

const QuickStatsWrapper = styled.div`
  ${({ quickStats }) => !quickStats ? 'visibility: hidden' : ''}
  margin-top: 30px;
`;

const LoaderText = styled.div`
  text-align: center;
  font-size: 28px;
  margin-bottom: 10px;
  
  p {
    margin-bottom: 10px;
    
    &:last-child {
      margin-top: 20px;
    }
  }
  
  @media only screen and (max-width: 450px) {
    font-size: 18px;
  }
  
  svg {
    fill: black;
    width: 200px;
    height: 100px;
    animation: spin 1.5s ease infinite
  }
  
  @keyframes spin {
    0% {transform: rotateY(0deg)}
    100% {transform: rotateY(360deg)
  }
}
`;

const LogoLoader = ({ playerProfile, newPlayer = true, quickStats = false, loading = false }) => {
  const levN = quickStats ? quickStats.raidCount.lev.success.normal : '';
  const levP = quickStats ? quickStats.raidCount.lev.success.prestige : '';
  const eow = quickStats ? quickStats.raidCount.eow.success.normal : '';
  const spire = quickStats ? quickStats.raidCount.spire.success.normal : '';

  if(loading) {
    return (
      <LoaderWrapper>
        {!newPlayer ? <OND2Logo/> :
          <Modal classNames={{modal: 'quick-stats'}} open={loading} close={!loading} showCloseIcon={false} closeOnOverlayClick={false} center>

            <Header style={{ textDecoration: 'underline' }} textAlign="center">Quick Stats</Header>

            <LoaderText>
                <OND2Logo/>
                <p>Next time this will be fast,</p>
                <p>but for now we have to get</p>
                <p>your data from BUNGIE.</p>
                <p>Hang in there!</p>
            </LoaderText>

            <QuickStatsWrapper quickStats={quickStats}>
              <Item.Group className="require-stats" divided>
                <Item>
                  <Item.Image size='tiny' src="/assets/leviathan_splash.jpg"/>
                  <Item.Content verticalAlign='middle'>
                    <Item.Header>Leviathan</Item.Header>
                    <Item.Description>{levP} Prestige | {levN} Normal</Item.Description>
                  </Item.Content>
                </Item>

                <Item>
                  <Item.Image size='tiny' src="/assets/eow_splash.jpg"/>
                  <Item.Content verticalAlign='middle'>
                    <Item.Header>Eater Of Worlds</Item.Header>
                    <Item.Description>{eow} Normal</Item.Description>
                  </Item.Content>
                </Item>

                <Item>
                  <Item.Image size='tiny' src="/assets/spire_splash.jpg"/>
                  <Item.Content verticalAlign='middle'>
                    <Item.Header>Spire of Stars</Item.Header>
                    <Item.Description>{spire} Normal</Item.Description>
                  </Item.Content>
                </Item>
              </Item.Group>
            </QuickStatsWrapper>
          </Modal>
        }
      </LoaderWrapper>
    )
  } else {
    return null;
  }
};

export default LogoLoader;

/*
              <Item>
                <Item.Image size='tiny' src="/assets/nightfall_splash.jpg"/>
                <Item.Content verticalAlign='middle'>
                  <Item.Header>Nightfall</Item.Header>
                  <Item.Description>## Prestige ## Normal</Item.Description>
                </Item.Content>
              </Item>
 */