import React from "react";
import App from "./App";
import { Provider } from "react-redux";

import { store } from "./store";

import { dbContext } from "./dbContext";
import IndexedDb from "./indexed-db.js";
import HyperDb from "./hyper-db.js";

let indexedDb = IndexedDb(store);
let hyperDb = HyperDb(store, indexedDb);

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
