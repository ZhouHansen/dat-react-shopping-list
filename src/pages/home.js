import React from "react";
import prettyHash from "pretty-hash";
import { connect } from "react-redux";
import styled from "styled-components";
import Header from "../components/header";
import { Button } from "../components/button";
import { hyperDb } from "../store";
import { Link } from "react-router-dom";
import Footer from "../components/footer";

@connect(state => ({
  documents: state[hyperDb.constant("Documents").name]
}))
class Home extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        <Header></Header>
        <section className="content">
          <div className="uvp">
            <h4 onClick={() => {}}>Test drive multi-writer Dat!</h4>
            <p>
              This is a <b>Progressive Web App</b> built to demonstrate the use
              of the new <b> multi-writer</b> capabilities from the{" "}
              <a href="https://datproject.org/" className="link">
                Dat Project
              </a>
              .
            </p>
            <p>
              Make shopping lists and use them online or offline, and sync
              between multiple devices or users. Read the{" "}
              <a
                href="https://blog.datproject.org/2018/05/14/dat-shopping-list/"
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                blog post!
              </a>
            </p>
          </div>
          <header>
            {this.props.documents.length > 0 ? <h3>Shopping Lists</h3> : ""}
          </header>
          <ul>
            {this.props.documents.map(doc => (
              <li
                key={doc.key}
                onClick={click}
                onKeyDown={keydown}
                tabIndex="0"
                role="button"
              >
                <span>{prettyHash(doc.key)}</span>
                <a href={"/doc/" + doc.key} className="link" tabIndex="-1">
                  {doc.name}
                </a>
              </li>
            ))}
          </ul>
          <div className={this.props.documents.length > 0 ? "notSolo" : "solo"}>
            <img src="bg-landing-page.svg" alt="" />
            <Link className="createButton" to={"/create"}>
              <Button label="Create a new Shopping List" />
            </Link>
            <Link className="addLinkButton" to={"/addLink"}>
              <Button label="Have a Link? Paste it Here" />
            </Link>
          </div>
          <Footer />
        </section>
      </div>
    );

    function click(event) {
      let link = event.target.querySelector("a");
      if (link) link.click();
    }

    function keydown(event) {
      if (event.key === " " || event.key === "Enter") {
        event.target.querySelector("a").click();
      }
    }
  }
}

export default styled(Home)`
  .content {
    margin: 1rem 1rem 2rem 1rem;
  }
  .uvp {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
    padding: 1em;
    background-color: var(--color-white);
  }
  .uvp h4 {
    margin: 0.5rem 1rem 1rem 1rem;
    font-size: 1.3rem;
    text-align: center;
  }
  h3 {
    margin-top: 2rem;
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
    position: relative;
    cursor: pointer;
    font-size: 1.2rem;
    background-color: var(--color-white);
    display: flex;

    .link {
      margin: 1rem 0.5rem;
    }

    span {
      font-size: 12px;
      font-family: monospace;
      line-height: 1rem;
      position: absolute;
      top: 0.1rem;
      right: 0.3rem;
      pointer-events: none;
    }
  }
  .solo {
    position: relative;
    height: 16rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    margin-bottom: 3rem;

    button {
      height: 4rem;
    }

    .addLinkButton button {
      margin-top: 1.5rem;
      height: 2.5rem;
      font-size: 0.8rem;
      font-weight: 500;
    }

    img {
      position: absolute;
    }
  }

  .notSolo {
    display: flex;
    justify-content: space-between;
    margin: 0 0.5rem 2rem 0.5rem;

    .createButton {
      margin-right: 0.5rem;
    }

    img {
      display: none;
    }

    .addLinkButton {
      margin-left: 0.5rem;
    }
  }

  .addLinkButton button {
    color: var(--color-green);
    background: var(--color-white);
    border-color: var(--color-green);
  }
`;
