import React from "react";
import prettyHash from "pretty-hash";
import { connect } from "react-redux";
import Header from "../components/header";
import { Button } from "../components/button";
import mystore from "../store";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import history from "../history";

@connect(state => ({
  documents: state[mystore.hyperDb.documents]
}))
class Home extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        <Header></Header>
        <section className="m-4 mb-8">
          <div className="shadow-lg p-4 bg-white">
            <h4 className="m-4 m-2 text-xl text-center">
              Test drive multi-writer Dat!
            </h4>
            <p>
              This is a <b>Progressive Web App</b> built to demonstrate the use
              of the new <b> multi-writer</b> capabilities from the{" "}
              <a
                href="https://datproject.org/"
                className="no-underline text-green-500"
              >
                Dat Project
              </a>
              .
            </p>
            <p>
              Make shopping lists and use them online or offline, and sync
              between multiple devices or users. Read the{" "}
              <a
                href="https://blog.datproject.org/2018/05/14/dat-shopping-list/"
                className="no-underline text-green-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                blog post!
              </a>
            </p>
          </div>
          <header>
            {this.props.documents.length > 0 ? (
              <h3 className="mt-4">Shopping Lists</h3>
            ) : (
              ""
            )}
          </header>
          <ul className="pt-0 px-1 pb-2">
            {this.props.documents.map(doc => (
              <li
                className="
                  bg-white
                  cursor-pointer 
                  text-lg list-none 
                  mb-2 px-2 border-solid 
                  border border-gray-300 
                  rounded-lg min-h-12 
                  relative flex"
                key={doc.key}
                onClick={() => {
                  history.push(`/doc/${doc.key}`);
                }}
                tabIndex="0"
                role="button"
              >
                <span
                  className="
                    text-xs font-mono
                    leading-none absolute
                    right-0 mr-2 mt-1 
                    pointer-events-none"
                >
                  {prettyHash(doc.key)}
                </span>
                <p className="my-4 mx-2 no-underline text-green-500">
                  {doc.name}
                </p>
              </li>
            ))}
          </ul>
          <div
            className={
              this.props.documents.length > 0
                ? "flex justify-between mx-2 mt-0 mb-4"
                : "relative h-64 flex items-center justify-center flex-col mb-12"
            }
          >
            <img
              className={
                this.props.documents.length > 0 ? "hidden" : "absolute"
              }
              src="bg-landing-page.svg"
              alt=""
            />
            <Link className="mr-2" to={"/create"}>
              <Button
                className={
                  "text-white " +
                  (this.props.documents.length > 0 ? "" : "h-16")
                }
                label="Create a new Shopping List"
              />
            </Link>
            <Link className="ml-2" to={"/addLink"}>
              <Button
                className={
                  "border-solid border border-green-500 text-green-500 bg-white " +
                  (this.props.documents.length > 0
                    ? ""
                    : "h-16 mt-5 h-10 text-sm font-medium")
                }
                label="Have a Link? Paste it Here"
              />
            </Link>
          </div>
          <Footer />
        </section>
      </div>
    );
  }
}

export default Home;
