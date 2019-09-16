import React from "react";
import styled from "styled-components";
import GithubButton from "./githubButton";

class Footer extends React.Component {
  render() {
    return (
      <section className={this.props.className}>
        <a href="https://glitch.com/edit/#!/dat-react-shopping-list">
          <img
            src="https://cdn.glitch.com/2bdfb3f8-05ef-4035-a06e-2043962a3a13%2Fview-source%402x.png?1513093958802"
            alt="view source button"
            aria-label="view source"
            height="33"
          />
        </a>
        <a href="https://glitch.com/edit/#!/remix/dat-react-shopping-list">
          <img
            src="https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg"
            alt="Remix on Glitch"
          />
        </a>
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
