import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';

import BigTable from "./BigTable";
import SmallTable from "./SmallTable";

const PGCRWrapper = styled.div`
  height: 100%;
  max-width: 90%;
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
    font-size: 16px;
  }
 
`;

const PGCRTitle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  color: black;
`;

const sortByValue = (arr, column, direction, raidName) => {

  return arr && arr.sort((a, b) => {
    const itemA = (column === 'name') ? a.player.displayName.toUpperCase() : (column === 'score') ? a.values.score : a.values[column];
    const itemB = (column === 'name') ? b.player.displayName.toUpperCase() : (column === 'score') ? b.values.score : b.values[column];

    const aComplete = raidName === 'Nightfall' ?
      a.values.timePlayedSeconds > 300 && a.values.completionReason === 0 && a.values.completed === 1
      : a.values.timePlayedSeconds > 300 && a.values.completionReason === 0 && a.values.completed === 1;

    const bComplete = raidName === 'Nightfall' ?
      b.values.timePlayedSeconds > 300 && b.values.completionReason === 0 && b.values.completed === 1
        : b.values.timePlayedSeconds > 300 && b.values.completionReason === 0 && b.values.completed === 1;


    const aDidComplete = a.values.completionReason === 0 && a.values.completed === 1;
    const bDidComplete = b.values.completionReason === 0 && b.values.completed === 1;

    if(!aComplete && !aDidComplete) return direction === 'ascending' ? -1 : 1;
    if(!bComplete && !bDidComplete) return direction === 'ascending' ? 1 : -1;

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
      initialSort: true,
      screenResize: false
    };
  }

  handleResize = () => {
    this.setState({ screenResize: !this.state.screenResize })
  };

  componentDidMount() {
      window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
      window.removeEventListener("resize", this.handleResize);
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

  handleSort = (clickedColumn, resize=false) => {
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

    const landscape = window.innerWidth > window.innerHeight;
    const mobilePortrait = isMobile && !landscape;

    const isNF = raidName === 'Nightfall' ;


    if(initialSort && (column === 'score' && raidName === 'Leviathan' || raidName === 'Eater of Worlds' || raidName === 'Spire of Stars')) {
      this.handleSort('kills');
    }

    return(
      <PGCRWrapper>
        <PGCRTitle>
          <h1>{raidName}</h1>
          <h2>{raidDate}</h2>
        </PGCRTitle>
        {mobilePortrait ?
          <SmallTable raidData={data} isNF={isNF} column={column} direction={direction} handleSort={this.handleSort} />
          : <BigTable raidData={data} isNF={isNF} column={column} direction={direction} handleSort={this.handleSort} />
        }
      </PGCRWrapper>
    );
  }
}

PostGameCarnageReportTable.propTypes = {
  pgcr: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  handleClearPGCR: PropTypes.func.isRequired
};

export default PostGameCarnageReportTable;