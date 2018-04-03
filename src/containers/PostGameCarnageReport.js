import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import PostGameCarnageReportTable from '../components/PostGameCarnageReportTable';

class PostGameCarnageReport extends Component {

  componentDidMount() {
    const { handleFetchPGCR, handleClearLoader, match } = this.props;
    handleFetchPGCR(match.params.instanceId);
    handleClearLoader();
  }

  componentWillUnmount() {
    this.props.handleClearPGCR();
  }

  render() {
    return(
      <PostGameCarnageReportTable {...this.props} />
    )
  }
}

export default withRouter(PostGameCarnageReport);