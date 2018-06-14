import React  from 'react';
import { Link } from 'react-router-dom';
import shortid from "shortid";

import { Table } from 'semantic-ui-react';

const BigTable = ({ isNF, raidData, column, direction, handleSort }) => {
  return (
    <Table compact unstackable sortable celled fixed>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={4} textAlign='center' sorted={column === 'name' ? direction : null} onClick={() => handleSort('name')}>
            Name
          </Table.HeaderCell>
          { isNF &&
            <Table.HeaderCell width={2} textAlign='center' sorted={ column === 'score' ? direction : null } onClick={ () => handleSort('score') }>
              Score
            </Table.HeaderCell>
          }
          <Table.HeaderCell width={2} textAlign='center' sorted={column === 'kills' ? direction : null} onClick={() => handleSort('kills')}>
            Kills
          </Table.HeaderCell>
          <Table.HeaderCell width={2} textAlign='center' sorted={column === 'deaths' ? direction : null} onClick={() => handleSort('deaths')}>
            Deaths
          </Table.HeaderCell>
          <Table.HeaderCell width={2} textAlign='center' sorted={column === 'assists' ? direction : null} onClick={() => handleSort('assists')}>
            Assists
          </Table.HeaderCell>
          <Table.HeaderCell width={2} textAlign='center' sorted={column === 'killsDeathsRatio' ? direction : null} onClick={() => handleSort('killsDeathsRatio')}>
            KDA
          </Table.HeaderCell>
          <Table.HeaderCell width={2} textAlign='center' sorted={column === 'timePlayedSeconds' ? direction : null} onClick={() => handleSort('timePlayedSeconds')}>
            Time Played
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {raidData && raidData.map(entry => {
          const { player: { displayName }, values } = entry;

          const completed = values.completionReason === 0 && values.completed === 1;

          return (
            <Table.Row textAlign='center' negative={!completed} key={shortid.generate()}>
              <td><Link to={`/player/${displayName.toLowerCase()}`}>{displayName}</Link></td>
              { isNF &&
                <Table.Cell>{ `${values.score}` }</Table.Cell>
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
  )
};

export default BigTable;