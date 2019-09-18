import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { netWork } from "./constants";
import { dbContext } from "./dbContext";

import { Home, Create, ShoppingList, AddLink } from "./pages/index";
import "./App.css";
import "dat-colors/index.css";

@connect(state => ({
  netWorkStatus: state[netWork.constant("Status").name]
}))
@withRouter
class App extends React.Component {
  static contextType = dbContext;

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    this.context.hyperDb.updateDoc();
  }

  componentDidMount() {
    let that = this;
    this.context.hyperDb.updateDoc();
    this.context.indexedDb.ready();
    updateOnlineStatus();

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    function updateOnlineStatus() {
      that.props.dispatch(netWork.action("Status", "update", navigator.onLine));
    }
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/create" component={Create} />
        <Route exact path="/addLink" component={AddLink} />
        <Route exact path="/doc/:key" component={ShoppingList} />
      </Switch>
    );
  }
}

export default App;