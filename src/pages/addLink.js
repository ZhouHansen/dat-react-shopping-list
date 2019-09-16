import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Header from "../components/header";
import { Submit } from "../components/button";
import { dbContext } from "../dbContext";
import CustomAlert from "../components/customAlert";

@connect()
class AddLink extends React.Component {
  static contextType = dbContext;
  constructor() {
    super();
    this.submit = this.submit.bind(this);
  }

  submit(event) {
    const link = event.target.querySelector("input").value;

    if (link) {
      this.context.hyperDb.addLink(link);
    }

    event.preventDefault();
  }

  render() {
    return (
      <div className={this.props.className}>
        <Header></Header>
        <div className="content">
          <h2>Paste in a URL link or a hexadecimal key</h2>
          <form onSubmit={this.submit}>
            <input type="text" autoFocus />
            <p>
              <Submit label="Submit" />
            </p>
          </form>
        </div>

        <CustomAlert></CustomAlert>
      </div>
    );
  }
}

export default styled(AddLink)`
  .content {
    margin: 1em;
  }
  input[type="text"] {
    width: 100%;
    font-size: 1.5rem;
  }
`;
