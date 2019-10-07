import React from "react";
import styled from "styled-components";
import GithubButton from "./githubButton";

class Footer extends React.Component {
  render() {
    return (
      <section className={this.props.className}>
        <GithubButton />
      </section>
    );
  }
}

export default styled(Footer)`
  margin-top: 1rem;
  margin-right: 1rem;
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  & > * {
    margin: 0.1rem;
  }

  & > a {
    margin-right: 0.2rem;
  }

  #more {
    justify-self: end;
    width: 7rem;
    margin-left: auto;
  }

  .github-button {
    opacity: 0;
  }
`;
