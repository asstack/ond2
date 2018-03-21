import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import PostGameCarnageReportTable from '../components/PostGameCarnageReportTable';

class PostGameCarnageReport extends Component {

  componentDidMount() {
    const { handleFetchPGCR, match } = this.props;
    handleFetchPGCR(match.params.instanceId);
  }

  componentWillUnmount() {
    this.props.handleClearPGCR();
  }


  render() {
    const { handleClearPGCR, pgcr } = this.props;
    return(
      <PostGameCarnageReportTable handleClearPGCR={handleClearPGCR} pgcr={pgcr} />
    )
  }
}

export default withRouter(PostGameCarnageReport);