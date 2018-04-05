import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import shortid from "shortid";
import styled from 'styled-components';

import { Table } from 'semantic-ui-react';

const PGCRWrapper = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: 50px;
  
  font-family: Montserrat;
  font-weight: bolder;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: bottom;
  margin-bottom: 20px;
    
  h1 {
    font-size: 40px;
  }
  
  h2 {
    font-size: 14px;
  }
  
  @media only screen and (max-width: 770px) {
    width: 100%;
    font-size: 12px;
    
  }
`;

const PGCRTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
`;


const sortByValue = (arr, column, direction) => {
  return arr && arr.sort((a, b) => {
    const itemA = (column === 'name') ? a.player.displayName.toUpperCase() : (column === 'score') ? a.values.score : a.values[column.toLowerCase()];
    const itemB = (column === 'name') ? b.player.displayName.toUpperCase() : (column === 'score') ? b.values.score : b.values[column.toLowerCase()];


    const aComplete = a.values.completionReason === 0 && a.values.completed === 1;
    const bComplete = b.values.completionReason === 0 && b.values.completed === 1;


    if(!aComplete) return direction === 'ascending' ? 1 : 1;
    if(!bComplete) return direction === 'ascending' ? -1 : -1;

    if (itemA < itemB) {
      return direction === 'ascending' ? -1 : 1;
    }
    if (itemA > itemB) {
      return direction === 'ascending' ? 1 : -1;
    }

    // names must be equal
    return 0;
  })
};


class PostGameCarnageReportTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      column : 'score',
      data: this.props.pgcr.entries,
      direction: 'ascending',
      raidName: null,
      raidDate: null
    }
  }

  componentWillReceiveProps(nextProps) {
    if(!this.state.data && nextProps.pgcr && nextProps.pgcr.entries.length !== 0) {
      this.setState({
        data: nextProps.pgcr.entries,
        raidName: nextProps.pgcr.raid.raidName,
        raidDate: nextProps.pgcr.raidDate
      })
    }
  }

  handleSort = clickedColumn => {
    const { column, data, direction } = this.state;

    this.setState({
      column: clickedColumn,
      data: sortByValue(data, clickedColumn, direction),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
  };

  render() {
    const { data, column, direction, raidName='Nightfall', raidDate } = this.state;
    console.log('raidName', raidName);

    const isNF = (raidName !== 'Leviathan' && raidName !== 'Eater of Worlds' && raidName !== '');

    if(column === 'score' && raidName === 'Leviathan' || raidName === 'Eater of Worlds') this.handleSort('kills');

    return(
      <PGCRWrapper>
        <PGCRTitle>
          <h1>{raidName}</h1>
          <h2>{raidDate}</h2>
        </PGCRTitle>
        <Table unstackable sortable celled fixed>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell sorted={column === 'name' ? direction : null} onClick={() => this.handleSort('name')}>
                Name
              </Table.HeaderCell>
              { isNF &&
                <Table.HeaderCell sorted={ column === 'score' ? direction : null } onClick={ () => this.handleSort('score') }>
                  Score
                </Table.HeaderCell>
              }
              <Table.HeaderCell sorted={column === 'kills' ? direction : null} onClick={() => this.handleSort('kills')}>
                Kills
              </Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'deaths' ? direction : null} onClick={() => this.handleSort('deaths')}>
                Deaths
              </Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'assists' ? direction : null} onClick={() => this.handleSort('assists')}>
                Assists
              </Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'killsDeathsRatio' ? direction : null} onClick={() => this.handleSort('killsDeathsRatio')}>
                Kill Death Ratio
              </Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'timePlayedSeconds' ? direction : null} onClick={() => this.handleSort('timePlayedSeconds')}>
                Time Played
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data && data.map(entry => {
              const { player: { displayName }, values } = entry;

              const completed = values.completionReason === 0 && values.completed === 1;

              return (
                <Table.Row negative={!completed} key={shortid.generate()}>
                  <td><Link to={`/player/${displayName.toLowerCase()}`}>{displayName}</Link></td>
                  { isNF &&
                    <Table.Cell>{ `${values.score} / ${values.teamScore}` }</Table.Cell>
                  }
                  <Table.Cell>{values.kills}</Table.Cell>
                  <Table.Cell>{values.deaths}</Table.Cell>
                  <Table.Cell>{values.assists}</Table.Cell>
                  <Table.Cell>{Math.floor(values.killsDeathsRatio, 4)}</Table.Cell>
                  <Table.Cell>{Math.floor(values.timePlayedSeconds / 60, 2)}</Table.Cell>
                </Table.Row>
              )})}
          </Table.Body>
        </Table>
      </PGCRWrapper>
    );
  }
}

PostGameCarnageReportTable.propTypes = {
  pgcr: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  handleClearPGCR: PropTypes.func.isRequired
};

export default PostGameCarnageReportTable;

/*
<Table sortable celled fixed>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell sorted={column === 'name' ? direction : null} onClick={this.handleSort('name')}>
        Name
      </Table.HeaderCell>
      <Table.HeaderCell sorted={column === 'age' ? direction : null} onClick={this.handleSort('age')}>
        Age
      </Table.HeaderCell>
      <Table.HeaderCell sorted={column === 'gender' ? direction : null} onClick={this.handleSort('gender')}>
        Gender
      </Table.HeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    {_.map(data, ({ age, gender, name }) => (
      <Table.Row key={name}>
        <Table.Cell>{name}</Table.Cell>
        <Table.Cell>{age}</Table.Cell>
        <Table.Cell>{gender}</Table.Cell>
      </Table.Row>
    ))}
  </Table.Body>
</Table>
*/

/*
    <h2 style={{ marginBottom: 5 }}>Raid Date: {pgcr.raidDate}</h2>
    <PGCRTable>
      <thead>
        <tr>
          <th>Player</th>
          <th>Score</th>
          <th>Kills</th>
          <th>Deaths</th>
          <th>Assists</th>
          <th>KDA</th>
          <th>Time (m)</th>
        </tr>
      </thead>
      <tbody>
        {
          pgcr && pgcr.entries.map(entry => {
            const { player: { displayName }, values } = entry;
            return (
              <tr key={shortid.generate()}>
                <td><Link to={`/destiny/player/${displayName.toLowerCase()}`}>{displayName}</Link></td>
                <td>{`${values.score} / ${values.teamScore}`}</td>
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
 */