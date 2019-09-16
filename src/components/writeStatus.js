import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { hyperDb } from "../constants.js";
import { Button, Submit } from "./button.js";
import copy from "clipboard-copy";
import { dbContext } from "../dbContext";
import { toggleCustomAlert, toggleWriteStatusCollapsed } from "../sagas";
import raw from "nanohtml/raw";

@connect(state => ({
  archive: state[hyperDb.constant("Archive").name],
  writeStatusCollapsed: state[hyperDb.constant("WriteStatusCollapsed").name],
  authorized: state[hyperDb.constant("Authorized").name],
  localKeyCopied: state[hyperDb.constant("LocalKeyCopied").name]
}))
class WriteStatus extends React.Component {
  static contextType = dbContext;
  render() {
    let {
      archive,
      authorized,
      writeStatusCollapsed,
      localKeyCopied,
      dispatch
    } = this.props;
    let db = archive && archive.db;

    if (!db) return null;

    const localKey = db.local.key.toString("hex");
    let sourceCopy = null;
    if (!writeStatusCollapsed) {
      sourceCopy =
        db.local === db.source
          ? "You created this document."
          : "You joined this document.";
    }
    let authStatus = null;

    if (authorized) {
      authStatus = writeStatusCollapsed ? (
        <div>
          <span className="okAuth">Authorized</span> (Expand to add a writer)
        </div>
      ) : (
        <div className="okAuth">
          You are authorized to write to this document.
        </div>
      );
    } else {
      let explanationAndLocalKey = null;
      if (!writeStatusCollapsed) {
        explanationAndLocalKey = (
          <div>
            <p className="help">
              You may edit your local copy, but changes will not be synchronized
              until you pass your "local key" to an owner of the document and
              they authorize you.
            </p>
            <div className="localKeySection" onClick={e => e.stopPropagation()}>
              Your local key is:
              <div className="noWrap">
                <span className="localKey">{localKey}</span>
              </div>
              <Button
                label="Copy to Clipboard"
                onClick={() => {
                  copy(localKey).then(() => {
                    dispatch({
                      type: toggleCustomAlert,
                      text: 'Local Key" copied to clipboard'
                    });
                    dispatch(hyperDb.action("LocalKeyCopied", "update", true));
                  });
                }}
              />
              {localKeyCopied ? "Copied!" : null}
            </div>
          </div>
        );
      }
      let noAuth = writeStatusCollapsed ? (
        <div className="noAuth">
          You are not currently authorized to write to this document.
        </div>
      ) : (
        <div>
          <span className="noAuth">Not authorized</span>
          (Expand for more info)
        </div>
      );

      authStatus = (
        <div>
          {noAuth}
          {explanationAndLocalKey}
        </div>
      );
    }

    let authForm =
      !writeStatusCollapsed && authorized ? (
        <form
          onSubmit={event => {
            // todo recheck it, here may not works.
            const input = event.target.querySelector("input");
            const writerKey = input.value.trim();
            if (writerKey !== "") {
              this.context.hyperDb.authorize(writerKey);
              input.value = "";
            }
            event.preventDefault();
          }}
        >
          <p className="help">
            You can share this shopping list to multiple devices or other
            people. Just copy the URL and paste it into another browser. (Hint:
            You can click on the "hex number" on the upper right to copy the URL
            to your clipboard). Other copies may write to this document if you
            authorize them by pasting their 'local key' into the form below.
          </p>
          <div className="writerInputs" onClick={e => e.stopPropagation()}>
            <div>Add a writer:</div>
            <input
              type="text"
              placeholder="Writer Local Key"
              spellCheck="false"
            />
            <Submit label="Authorize" />
          </div>
        </form>
      ) : null;

    return (
      <section
        className={this.props.className}
        onClick={() => {
          dispatch({ type: toggleWriteStatusCollapsed });
        }}
      >
        <div className="collapseExpand" tabIndex="0">
          {writeStatusCollapsed
            ? raw("&#x25bc; Expand")[0].textContent
            : raw("&#x25b2; Collapse")[0].textContent}
        </div>
        <div>{sourceCopy}</div>
        {authStatus}
        {authForm}
      </section>
    );
  }
}

export default styled(WriteStatus)`
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  padding: 0.7rem;
  position: relative;
  -webkit-tap-highlight-color: transparent;

  .collapseExpand {
    position: absolute;
    top: -0.8rem;
    right: 0.6rem;
    z-index: 1;
    font-size: 0.8rem;
    cursor: pointer;
    color: var(--color-green);
    background: var(--color-white);
    border: 2px solid var(--color-neutral-10);
    border-radius: 0.8rem;
    width: 5rem;
    height: 1.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .noAuth {
    color: var(--color-red);
    font-weight: 700;
  }

  .okAuth {
    color: var(--color-green);
    font-weight: 700;
  }

  .help {
    font-size: 0.8rem;
    font-weight: 500;
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }

  .localKeySection {
    -webkit-tap-highlight-color: black;
    background: var(--color-neutral-10);
    padding: 0.5rem;

    .noWrap {
      white-space: nowrap;
      display: flex;

      .localKey {
        color: var(--color-blue-darker);
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }

    @media only screen and (min-device-width: 500px) and (max-device-width: 600px) {
      .localKey {
        font-size: 12px;
      }
    }

    @media only screen and (min-device-width: 400px) and (max-device-width: 500px) {
      .localKey {
        font-size: 10px;
      }
    }

    @media only screen and (max-width: 400px) {
      .localKey {
        font-size: 8px;
      }
    }

    button {
      font-size: 0.7rem;
      padding: 0.5rem 0.5rem;
      font-weight: 400;
      margin-right: 1rem;
    }
  }

  form {
    margin: 0;

    .writerInputs {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      font-size: 16px;

      div {
        margin-right: 0.4rem;
      }

      input[type="text"] {
        font-size: 16px;
        flex: 1;
        margin-right: 0.4rem;
      }

      input[type="submit"] {
        font-size: 16px;
        padding: 0.1rem 0.5rem;
        font-weight: 400;
      }
    }
  }
`;
