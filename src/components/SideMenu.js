import React from 'react';
import { Link } from 'react-router-dom';
import { Sidebar, Container, Icon, Menu } from 'semantic-ui-react';
import OND2Logo from './OND2Logo';

const SideMenu = ({ children, visible, toggle }) => {
  return (
    <Sidebar.Pushable className="remove-margins" as={Container} fluid={true}>
      <Sidebar as={Menu} animation='overlay' width='wide' direction='left' visible={visible} icon='labeled' vertical inverted>
        <Menu.Item as={Link} to='/' onClick={toggle} style={{ fill: 'white' }} name='home' >
          <div style={{ width: '50%', height: '50%', margin: '0 auto'}}>
            <OND2Logo fillColor='white' />
          </div>
        </Menu.Item>
        <Menu.Item as={Link} onClick={toggle} to='/' name='home'>
          <Icon name='home' />
          Home
        </Menu.Item>
        <Menu.Item as={Link} onClick={toggle} to='/donate' name='money'>
          <Icon name='money' />
          Donate
        </Menu.Item>
      </Sidebar>
      <Sidebar.Pusher onClick={() => visible && toggle()} dimmed={visible}>
        {children}
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default SideMenu;