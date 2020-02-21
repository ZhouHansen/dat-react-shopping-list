import React from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import mystore from "./store";
import { dbContext } from "./dbContext";

import { Home, Create, shoppingList, AddLink } from "./pages/index";
import "./App.css";
import "dat-colors/index.css";

@connect(state => ({
  netWorkStatus: state[mystore.netWork.status]
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
    this.context.hyperDb.updateDoc();
    this.context.indexedDb.ready();
    updateOnlineStatus();

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    function updateOnlineStatus() {
      mystore.netWork.update("status", navigator.onLine);
    }
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/create" component={Create} />
        <Route exact path="/addLink" component={AddLink} />
        <Route exact path="/doc/:key" component={shoppingList} />
      </Switch>
    );
  }
}

export default App;
