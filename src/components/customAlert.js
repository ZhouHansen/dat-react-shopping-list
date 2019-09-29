import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { customAlert } from "../store";
import { dbContext } from "../dbContext";
import { Button } from "./button.js";
import FocusLock from "react-focus-lock";
import { toggleCustomAlert } from "../sagas";

@connect(state => ({
  show: state[customAlert.constant("Show").name],
  text: state[customAlert.constant("Text").name],
  isTrap: state[customAlert.constant("IsTrap").name]
}))
class Alert extends React.Component {
  static contextType = dbContext;
  constructor() {
    super();
    this.closeAlert = this.closeAlert.bind(this);
  }
  closeAlert() {
    let { dispatch } = this.props;
    dispatch({ type: toggleCustomAlert });
  }
  render() {
    let { show, text, className, isTrap } = this.props;

    return (
      <FocusLock disabled={!isTrap}>
        <div
          onClick={this.closeAlert}
          className={className + (show ? " show" : "")}
        >
          <div className="alertContent">
            <div>{text}</div>
            <Button label="OK" onClick={this.closeAlert}></Button>
          </div>
        </div>
      </FocusLock>
    );
  }
}

export default styled(Alert)`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.3s;

  &.show {
    visibility: visible;
    opacity: 1;

    .alertContent {
      transform: scale(1);
      opacity: 1;
    }
  }

  .alertContent {
    background: white;
    border: 1px solid black;
    padding: 3rem;
    margin: 3rem;
    font-size: 1.5rem;
    transform: scale(0.7);
    opacity: 0;
    transition: all 0.3s;
    border-radius: 0.5rem;

    button {
      margin: 2rem 0 0 0;
      width: 100%;
      font-size: 1.2rem;
      padding: 1rem;
    }
  }
`;
