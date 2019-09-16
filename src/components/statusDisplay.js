import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import { netWork, app } from "../constants.js";
import SvgIcon from "../../public/ic_sync_black_24px.svg";

@connect(state => ({
  localUploadLength: state[netWork.constant("LocalUploadLength").name],
  syncedUploadLength: state[netWork.constant("SyncedUploadLength").name],
  localDownloadLength: state[netWork.constant("LocalDownloadLength").name],
  syncedDownloadLength: state[netWork.constant("SyncedDownloadLength").name],
  networkStatus: state[netWork.constant("Status").name],
  connected: state[netWork.constant("Connected").name],
  connecting: state[netWork.constant("Connecting").name],
  devMode: state[app.constant("DevMode").name],
  devLabel: state[app.constant("DevLabel").name],
  serviceWorker: state[app.constant("ServiceWorker").name]
}))
class StatusDisplay extends React.Component {
  render() {
    let networkStatus;
    let connected;

    let pendingUpload =
      this.props.localUploadLength - this.props.syncedUploadLength;
    if (pendingUpload <= 0 || isNaN(pendingUpload)) pendingUpload = null;
    if (pendingUpload) pendingUpload = <span>{pendingUpload}↑</span>;
    let pendingDownload =
      this.props.localDownloadLength - this.props.syncedDownloadLength;
    if (pendingDownload <= 0 || isNaN(pendingDownload)) pendingDownload = null;
    if (pendingDownload) pendingDownload = <span>{pendingDownload}↓</span>;
    if (this.props.networkStatus !== undefined) {
      const onlineOffline = this.props.networkStatus ? (
        <span className="online">Online</span>
      ) : (
        <span className="offline">Offline</span>
      );
      networkStatus = (
        <div className="networkStatus">Network: {onlineOffline}</div>
      );
    }

    if (this.props.connected !== null) {
      if (this.props.connecting) {
        connected = (
          <span className="connecting">
            <span>
              <SvgIcon></SvgIcon>
            </span>
            {pendingDownload} {pendingUpload}
          </span>
        );
      } else if (this.props.connected) {
        connected = (
          <span className="online">
            <span>
              <SvgIcon></SvgIcon>
            </span>
            {pendingDownload} {pendingUpload}
          </span>
        );
      } else {
        if (this.props.networkStatus) {
          connected = (
            <span className="offline">
              <span>
                <img src="/ic_sync_problem_24px.svg" alt="" />
              </span>
              {pendingDownload} {pendingUpload}
            </span>
          );
        } else {
          connected = (
            <span className="offline">
              <span>
                <img src="/ic_sync_disabled_24px.svg" alt="" />
              </span>
              {pendingDownload} {pendingUpload}
            </span>
          );
        }
      }
      connected = <div className="connected">Sync: {connected}</div>;
    }
    let serviceWorker = this.props.serviceWorker ? (
      <div>Worker Ready</div>
    ) : null;
    let devLabel = this.props.devMode ? (
      <div>Label: {this.props.devLabel}</div>
    ) : null;

    return (
      <div className={this.props.className}>
        {networkStatus}
        {connected}
        {serviceWorker}
        {devLabel}
      </div>
    );
  }
}

export default styled(StatusDisplay)`
  position: absolute;
  top: 0.4rem;
  right: 0.4rem;
  font-weight: 300;
  font-size: 0.8rem;

  @media only screen and (max-width: 350px) {
    font-size: 0.6rem;

    img {
      width: 0.7rem;
      height: 0.7rem;
    }
  }

  .online {
    color: var(--color-green);

    svg {
      fill: var(--color-green);
    }
  }

  .offline {
    color: var(--color-red);

    svg {
      fill: var(--color-red);
    }
  }

  .connecting {
    color: var(--color-yellow);

    svg {
      fill: var(--color-yellow);
    }
  }

  .online svg,
  .offline svg,
  .connecting svg {
    width: 1rem;
    height: 1rem;
    vertical-align: text-top;
  }

  img {
    width: 0.8rem;
    height: 0.8rem;
  }
`;
