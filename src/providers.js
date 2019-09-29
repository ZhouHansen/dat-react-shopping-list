import React from "react";
import App from "./App";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import thunk from "redux-thunk";

import * as cs from "./store";
import rootSaga from "./sagas";

import { dbContext } from "./dbContext";
import IndexedDb from "./indexed-db.js";
import HyperDb from "./hyper-db.js";

let sagaMiddleware = createSagaMiddleware();

let store = createStore(
  combineReducers(
    Object.keys(cs).reduce((sum, cur) => {
      return { ...sum, ...cs[cur].reducer() };
    }, {})
  ),
  compose(applyMiddleware(thunk, sagaMiddleware))
);
let indexedDb = IndexedDb(store);
let hyperDb = HyperDb(store, indexedDb);

sagaMiddleware.run(rootSaga);

class Providers extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <dbContext.Provider
          value={{
            indexedDb,
            hyperDb
          }}
        >
          <App />
        </dbContext.Provider>
      </Provider>
    );
  }
}

export default Providers;
