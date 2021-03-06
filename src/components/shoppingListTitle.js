import React from "react";
import styled from "styled-components";
import prettyHash from "pretty-hash";
import { connect } from "react-redux";
import { matchPath } from "react-router";

import mystore from "../store";
import history from "../history";
import copy from "clipboard-copy";
import { toggleCustomAlert } from "../sagas";

@connect(state => ({
  docTitle: state[mystore.hyperDb.docTitle],
  hyperDbKey: state[mystore.hyperDb.key]
}))
class ShoppingListTitle extends React.Component {
  constructor() {
    super();
    this.copyUrl = this.copyUrl.bind(this);
  }

  async copyUrl() {
    let path = matchPath(history.location.pathname, {
      path: "/doc/:doc",
      exact: true,
      strict: false
    });

    await copy(path.params.doc);

    this.props.dispatch({
      type: toggleCustomAlert,
      text: "Shopping list public key copied to clipboard"
    });
  }

  render() {
    return (
      <div className={this.props.className}>
        <h1>{this.props.docTitle}</h1>
        <div className="hash" onClick={this.copyUrl} tabIndex="0">
          {prettyHash(this.props.hyperDbKey)}
        </div>
      </div>
    );
  }
}

export default styled(ShoppingListTitle)`
  position: relative;
  h1 {
    margin: 0 0 0.5em 0;
  }
  .hash {
    font-size: 12px;
    font-family: monospace;
    position: absolute;
    font-weight: 600;
    top: -0.6rem;
    right: 0;
    cursor: pointer;
  }
`;
