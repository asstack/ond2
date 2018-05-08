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
  margin: 50px auto;
  
  font-family: Montserrat sans-serif;
  font-weight: bolder;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
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

const sortByValue = (arr, column, direction, raidName) => {
  return arr && arr.sort((a, b) => {
    const itemA = (column === 'name') ? a.player.displayName.toUpperCase() : (column === 'score') ? a.values.score : a.values[column];
    const itemB = (column === 'name') ? b.player.displayName.toUpperCase() : (column === 'score') ? b.values.score : b.values[column];


    const aComplete = raidName === 'Nightfall' ?
      a.values.timePlayedSeconds > 300 && a.values.completionReason === 0 && a.values.completed === 1
      : a.values.timePlayedSeconds > 300 && a.values.completionReason === 0;

    const bComplete = raidName === 'Nightfall' ?
      b.values.timePlayedSeconds > 300 && b.values.completionReason === 0 && b.values.completed === 1
        : b.values.timePlayedSeconds > 300 && b.values.completionReason === 0;


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
      direction: 'descending',
      raidName: null,
      raidDate: null,
      initialSort: true
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
    const { data, direction, raidName } = this.state;

    this.setState({
      column: clickedColumn,
      data: sortByValue(data, clickedColumn, direction, raidName),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
      initialSort: false
    });
  };

  render() {
    const { data, column, direction, raidName='Nightfall', raidDate, initialSort } = this.state;

    const isNF = !!raidName && (!raidName === 'Leviathan' && raidName !== 'Eater of Worlds' && raidName !== '');

    if(initialSort && (column === 'score' && raidName === 'Leviathan' || raidName === 'Eater of Worlds')) this.handleSort('killsDeathsRatio');

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
              <Table.HeaderCell sorted={column === 'killsDeathsRatio' ? direction : null} onClick={() => this.handleSort('killsDeathsRatio')}>
                KDA
              </Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'kills' ? direction : null} onClick={() => this.handleSort('kills')}>
                Kills
              </Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'deaths' ? direction : null} onClick={() => this.handleSort('deaths')}>
                Deaths
              </Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'assists' ? direction : null} onClick={() => this.handleSort('assists')}>
                Assists
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
                <Table.Row negative={!completed} disabled={!completed} key={shortid.generate()}>
                  <td><Link to={`/player/${displayName.toLowerCase()}`}>{displayName}</Link></td>
                  { isNF &&
                    <Table.Cell>{ `${values.score} / ${values.teamScore}` }</Table.Cell>
                  }
                  <Table.Cell>{Math.floor(values.killsDeathsRatio, 4)}</Table.Cell>
                  <Table.Cell>{values.kills}</Table.Cell>
                  <Table.Cell>{values.deaths}</Table.Cell>
                  <Table.Cell>{values.assists}</Table.Cell>
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