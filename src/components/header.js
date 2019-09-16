import React from "react";
import styled from "styled-components";
import StatusDisplay from "./statusDisplay";

class Header extends React.Component {
  render() {
    return (
      <nav className={this.props.className}>
        <a href="/">
          <img
            src="/dat-hexagon.svg
          "
            alt="Dat Project Logo"
          />
          <span className="title">
            <span className="first-word">Dat</span> Shopping List
          </span>
        </a>
        <StatusDisplay></StatusDisplay>
      </nav>
    );
  }
}

export default styled(Header)`
  border-bottom: 1px solid var(--color-neutral-10);
  flex: 0 64px;
  color: var(--color-neutral);
  font-weight: 700;
  font-size: 1.5rem;
  display: flex;
  padding-left: 1rem;
  padding-right: 1rem;
  position: relative;
  a {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    transition: opacity 0.15s ease-in;
    &:hover,
    &:focus {
      opacity: 0.5;
    }
    img {
      width: 2rem;
      height: 2rem;
      margin-right: 0.5rem;
      transition: transform 0.5s ease-in-out;
      &:hover,
      &:focus {
        transform: rotate(360deg);
      }
    }
  }
  .title {
    color: var(--color-neutral-60);
    white-space: nowrap;
  }
  .first-word {
    color: var(--color-neutral);
  }
`;
