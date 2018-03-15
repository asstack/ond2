import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import shortid from 'shortid';

const PGCRWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;  
  margin-top: 100px;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const PGCRTable = styled.table`
  width: 50%;
  height: 50%;
  border: 1px solid #ddd;
  text-align: left;
  
  
  & th, td {
      padding: 15px;
      text-align: left;
      border: 1px solid #ddd;
      text-align: left;
      
      a {
        color: black;
        text-decoration: underline;
      }
      
      a:link {
          text-decoration: none;
      }
      
      a:visited {
          text-decoration: none;
      }
      
      a:hover {
          color: blue;
      }
      
      a:active {
          text-decoration: underline;
      }
    }
  }
`;

const Nav = styled.div`
  width: 50%;
  margin-bottom: 10px;
`;

const PostGameCarnageReportTable = ({ handleClearPGCR, pgcr }) => (
  <PGCRWrapper>
    <Nav>
    </Nav>
    <h2 style={{ marginBottom: 5 }}>Raid Date: {pgcr.raidDate}</h2>
    <PGCRTable>
      <thead>
        <tr>
          <th>Player</th>
          <th>Kills</th>
          <th>Deaths</th>
          <th>Assists</th>
          <th>KDA</th>
          <th>Time (minutes)</th>
        </tr>
      </thead>
      <tbody>
        {
          pgcr && pgcr.entries.map(entry => {
            const { player: { displayName }, values } = entry;
            return (
              <tr key={shortid.generate()}>
                <td><Link to={`/destiny/player/${displayName.toLowerCase()}`}>{displayName}</Link></td>
                <td>{values.kills}</td>
                <td>{values.deaths}</td>
                <td>{values.assists}</td>
                <td>{Math.floor(values.killsDeathsRatio, 4)}</td>
                <td>{Math.floor(values.timePlayedSeconds / 60, 2)}</td>
              </tr>
            )
          })
        }
      </tbody>
    </PGCRTable>
  </PGCRWrapper>
);

class PostGameCarnageReportContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deepLink: false
    }
  }

  componentWillUnmount() {
    this.props.handleClearPGCR();
  }

  toggleDeepLink = () => {
    this.setState({ deepLink: !this.state.deepLink })
  };

  render() {
    const { deepLink } = this.state;
    const { match, handleDeepLink } = this.props;

    if(match.params.instanceId && !deepLink) {
      this.toggleDeepLink();
      handleDeepLink(match.params.instanceId);
    }

    return(
      <PostGameCarnageReportTable {...this.props} />
    )
  }
}

export default PostGameCarnageReportContainer;