import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import Header from "../components/header";
import WriteStatus from "../components/writeStatus";
import ShoppingListTitle from "../components/shoppingListTitle";
import { Submit } from "../components/button";
import { hyperDb } from "../store";
import { dbContext } from "../dbContext";
import CustomAlert from "../components/customAlert";
import Footer from "../components/footer";

@connect(state => ({
  shoppingList: state[hyperDb.constant("ShoppingList").name],
  loading: state[hyperDb.constant("Loading").name],
  error: state[hyperDb.constant("Error").name]
}))
class ShoppingList extends React.Component {
  static contextType = dbContext;

  constructor() {
    super();
    this.deleteList = this.deleteList.bind(this);
    this.keydown = this.keydown.bind(this);
  }

  render() {
    const { shoppingList, loading, error } = this.props;

    let Inner;
    let that = this;

    let Items = shoppingList
      .sort((a, b) => a.dateAdded - b.dateAdded)
      .map(item => {
        const id = item.file.replace(".json", "");
        return (
          <li
            tabIndex="0"
            role="button"
            key={item.dateAdded}
            onClick={toggle.bind(item)}
            onKeyDown={this.keydown}
          >
            <input
              type="checkbox"
              checked={item.bought}
              onChange={toggle.bind(item)}
              tabIndex="-1"
              id={id}
            />
            <div className="text" data-bought={item.bought}>
              {item.name}
            </div>
            <div className="delete" onClick={remove.bind(item)} tabIndex="0">
              &#x00d7;
            </div>
          </li>
        );

        function toggle() {
          that.context.hyperDb.toggleBought(this.file);
        }

        function remove(event) {
          that.context.hyperDb.removeShoppingItem(this.file);
          event.stopPropagation();
        }
      });

    if (loading) {
      Inner = "loading....";
    } else if (error) {
      Inner = (
        <div className="error">
          {error}
          <br />
          (Try reloading, there occasionally are problems during sync)
        </div>
      );
    } else {
      Inner = (
        <div>
          <ShoppingListTitle />
          <WriteStatus />
          <ul>
            {Items}{" "}
            <li className="addGroceryItem" id="addItem">
              <form onSubmit={submitAddItem}>
                <input type="text" />
                <Submit label="Add" />
              </form>
            </li>
          </ul>
        </div>
      );
    }

    function submitAddItem(event) {
      event.preventDefault();
      event.target.scrollIntoView();
      const input = event.target.querySelector("input");
      const name = input.value.trim();
      if (name !== "") that.context.hyperDb.addShoppingItem(name);
      input.value = "";
    }

    return (
      <div className={this.props.className}>
        <Header></Header>
        <section className="content">
          {Inner}
          <nav className="bottomNav">
            <a href="/" className="link">
              Home
            </a>
            <a href="/" className="delete" onClick={this.deleteList}>
              Delete List
            </a>
          </nav>
          <Footer />
        </section>

        <CustomAlert></CustomAlert>
      </div>
    );
  }

  deleteList(event) {
    let confirm = window.confirm("Delete this list?");

    if (confirm) {
      this.context.indexedDb.deleteCurrentDoc();
    }
    event.preventDefault();
  }

  keydown(event) {
    if (event.key === " " || event.key === "Enter") {
      event.target.click();
    }
  }
}

export default styled(ShoppingList)`
  .content {
    margin: 1rem 1rem 2rem 1rem;
  }

  .error {
    padding: 1rem;
    border: 2px solid red;
    border-radius: 1rem;
    text-align: center;
    margin: 1rem;
  }

  ul {
    padding: 0 0.3rem 0.5rem 0.3rem;
  }

  li {
    list-style-type: none;
    border: 1px solid var(--color-neutral-20);
    border-radius: 0.5rem;
    margin: 0 0 0.5rem 0;
    padding: 0 0.5rem;
    min-height: 3rem;
    cursor: pointer;
    font-size: 1.2rem;
    display: flex;
    align-items: center;

    &:focus {
      outline: none;
      border-color: var(--color-green);
    }

    input[type="checkbox"] {
      pointer-events: none;
      margin: 0 0.4rem;
    }

    .text {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 0.5rem;
    }

    .text[data-bought="true"] {
      text-decoration: line-through;
    }

    .delete {
      opacity: 0.6;
      font-size: 1.5rem;
      font-weight: 900;
      color: var(--color-green);
      flex: 0 0;
      padding: 0.6rem 0.6rem;
    }

    &.addGroceryItem {
      border-color: transparent;

      form {
        display: flex;
        margin: 0 0 0 1.5rem;
        width: 100%;

        input[type="text"] {
          font-size: 1.2rem;
          flex: 1;
          width: 100%;
        }

        button {
          margin-left: 0.6rem;
        }
      }
    }
  }

  .bottomNav {
    .delete {
      color: var(--color-red);
      text-decoration: none;
      float: right;
    }
  }
`;
