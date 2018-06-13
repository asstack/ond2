import React  from 'react';
import { Link } from 'react-router-dom';
import shortid from "shortid";

import { Table } from 'semantic-ui-react';

const SmallTable = ({ isNF, raidData, column, direction, handleSort }) => {
  return (
    <Table compact singleLine unstackable sortable celled fixed>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={10} textAlign='center' sorted={column === 'name' ? direction : null} onClick={() => handleSort('name')}>
            Name
          </Table.HeaderCell>
          {isNF ?
            <Table.HeaderCell width={6} textAlign='center' sorted={column === 'score' ? direction : null} onClick={() => handleSort('score')}>
              Score
            </Table.HeaderCell>
            :
            <Table.HeaderCell width={6} textAlign='center' sorted={column === 'kills' ? direction : null} onClick={() => handleSort('kills')}>
              Kills
            </Table.HeaderCell>
          }
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {raidData && raidData.map(entry => {
          const { player: { displayName }, values } = entry;

          const completed = values.completionReason === 0 && values.completed === 1;

          return (
            <Table.Row negative={!completed} key={shortid.generate()}>
              <td><Link to={`/player/${displayName.toLowerCase()}`}>{displayName}</Link></td>
              { isNF
                ? <Table.Cell textAlign='center' collapsing>{ `${values.score} / ${values.teamScore}` }</Table.Cell>
                  : <Table.Cell width={1} textAlign='center' collapsing>{values.kills}</Table.Cell>
              }
            </Table.Row>
          )})}
      </Table.Body>
    </Table>
  )
};

export default SmallTable;