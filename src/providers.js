import React from "react";
import App from "./App";
import { Provider } from "react-redux";
import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducers";

import rootSaga from "./sagas";

import { dbContext } from "./dbContext";
import IndexedDb from "./indexed-db.js";
import HyperDb from "./hyper-db.js";

let sagaMiddleware = createSagaMiddleware();

let store = createStore(
  reducer,
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
