import  React, { Component } from 'react';
import styled from 'styled-components';
import PostGameCarnageReportTable from "./pgcr-table/PostGameCarnageReportTable";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: auto;
  z-index: 999;
  background-color: rgba(0, 0, 0, .93);
  display: flex;
  flex-direction: row;
  align-content: centered;
  -webkit-transform: translateZ(0);
`;

const ModalContent = styled.div`
  z-index: 1000;
  margin: 0 auto;
  text-align: center;
  padding: 4px;
  cursor: pointer;
  -webkit-transform: translateZ(0);
`;

class PGCRModal extends Component {

  componentDidMount() {
    const { handleFetchPGCR, handleClearLoader, match } = this.props;
    handleFetchPGCR(match.params.instanceId);
    handleClearLoader();
    this.props.clearErrorState();
  }

  componentWillUnmount() {
    this.props.handleClearPGCR();
  }

  handleClick = () => {
    if(this.props.isModal) {
      this.props.history.goBack();
    } else {
      this.props.history.push('/');
    }
  };

  render() {
    return (
      <div onClick={this.handleClick}>
        <ModalOverlay>
          <ModalContent>
            <PostGameCarnageReportTable {...this.props} />
          </ModalContent>
        </ModalOverlay>
      </div>
    )
  }
}

export default PGCRModal;