import React, { Component } from "react";
import PropTypes from "prop-types";

import "../css/modal.css";

// The gray background
const backdropStyle = {
  position: "fixed",
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: "rgba(0,0,0,0.3)",
  padding: 50
};

// The modal "window"
const modalStyle = {
  backgroundColor: "#fff",
  borderRadius: 5,
  maxWidth: 500,
  minHeight: 200,
  margin: "0 auto",
  padding: 30
};

class Modal extends Component {
  render() {
    return (
      <div style={backdropStyle}>
        <div style={modalStyle}>
          {this.props.children}

          <div className="footer">
            <button onClick={this.props.onClose}>Close</button>
            <button onClick={this.props.onConfirm}>Confirm</button>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  show: PropTypes.bool,
  children: PropTypes.node
};

export default Modal;
