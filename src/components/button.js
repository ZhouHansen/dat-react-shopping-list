import React from "react";
import styled from "styled-components";

let css = `
    color: var(--color-white);
    background-color: var(--color-green);
    font-size: 1rem;
    font-weight: 700;
    text-decoration: none;
    padding: 0.5rem 1rem;
    display: inline-block;
    backface-visibility: hidden;
    transform: translateZ(0);
    transition: transform .25s ease-out,-webkit-transform .25s ease-out;
    border-color: transparent;
    &:active {
      transform: scale(0.9);
    }
    &:focus, &:hover {
      transform: scale(1.05);
    }
    -webkit-appearance: none;
    -moz-appearance: none;
    border-radius: 0;
    cursor: pointer;
    &::-moz-focus-inner { 
      border: 0; 
    }
`;

class Button extends React.Component {
  render() {
    return <button className={this.props.className}>{this.props.label}</button>;
  }
}

class Submit extends React.Component {
  render() {
    return (
      <input
        type="submit"
        className={this.props.className}
        value={this.props.label}
      />
    );
  }
}

Button = styled(Button)`
  ${css}
`;

Submit = styled(Button)`
  ${css}
`;

export { Button, Submit };
