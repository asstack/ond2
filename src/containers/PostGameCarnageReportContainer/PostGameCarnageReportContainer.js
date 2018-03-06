import React, { Component } from 'react';
import styled from 'styled-components';

const PGCRWrapper = styled.div`
  display: flex;
  flex-direction: column;  
  justify-content: center;  
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
    }
  }
`;

const Nav = styled.div`
  width: 50%;
  margin-bottom: 10px;
`;

class PostGameCarnageReportContainer extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { pgcr, handleClearPGCR } = this.props;
    const { entries, activityDetails, raid, raidDate } = pgcr;

    console.log('pgcr', pgcr);
    console.log('entries', entries);

    return(
      <PGCRWrapper>
        <Nav>
        <button onClick={handleClearPGCR}>{'< Back'}</button>
        </Nav>
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
              entries.map(entry => {
                console.log('entry', entry);
                const { player: { displayName }, values } = entry;
                return (
                  <tr>
                    <td>{displayName}</td>
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
    )
  }
}

export default PostGameCarnageReportContainer;