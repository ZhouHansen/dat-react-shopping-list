import React from "react";

const style = `inline-block px-2 py-4 no-underline cursor-pointer 
  bg-green-500 text-base font-bold transition duration-200 
  ease-in-out transition-transform 
  transform active:scale-90 focus:scale-105 hover:scale-105 `;

export class Button extends React.Component {
  render() {
    return (
      <button className={style + this.props.className}>
        {this.props.label}
      </button>
    );
  }
}

export class Submit extends React.Component {
  render() {
    return (
      <input
        type="submit"
        className={style + this.props.className}
        value={this.props.label}
      />
    );
  }
}
