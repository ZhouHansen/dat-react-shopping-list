import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Header from "../components/header";
import { Submit } from "../components/button";
import { dbContext } from "../dbContext";

@connect()
class Create extends React.Component {
  static contextType = dbContext;
  constructor() {
    super();
    this.submit = this.submit.bind(this);
  }

  submit(event) {
    let docName = event.target.querySelector("input").value;
    if (docName) {
      this.context.hyperDb.createDoc(docName);
    }
    event.preventDefault();
  }

  render() {
    return (
      <div className={this.props.className}>
        <Header></Header>
        <div className="content">
          <h2>Enter a name for your new shopping list</h2>
          <form onSubmit={this.submit}>
            <input type="text" autoFocus />
            <p>
              <Submit label="Submit" />
            </p>
          </form>
        </div>
      </div>
    );
  }
}

export default styled(Create)`
  .content {
    margin: 1em;
  }
  input[type="text"] {
    width: 100%;
    font-size: 1.5rem;
  }
`;
