import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import rootSaga from "./sagas";
import thunk from "redux-thunk";

let sagaMiddleware = createSagaMiddleware();

let initState = {
  hyperDb: [
    { name: "documents", value: [] },
    { name: "shoppingList", value: [] },
    { name: "key", value: null },
    { name: "archive", value: null },
    { name: "error", value: null },
    { name: "authorized", value: null },
    { name: "localKeyCopied", value: null },
    { name: "docTitle", value: null },
    { name: "loading", value: false },
    { name: "writeStatusCollapsed", value: true },
    { name: "localFeedLength", value: false },
    { name: "docKey", value: null }
  ],
  netWork: [
    { name: "lastSync", value: [] },
    { name: "syncedUploadLength", value: [] },
    { name: "syncedDownloadLength", value: null },
    { name: "localUploadLength", value: null },
    { name: "localDownloadLength", value: null },
    { name: "cancelGReplication", value: null },
    { name: "connecting", value: null },
    { name: "connected", value: null },
    { name: "status", value: null }
  ],
  app: [
    { name: "devMode", value: false },
    { name: "devLabel", value: null },
    { name: "serviceWorker", value: null }
  ],
  customAlert: [
    { name: "show", value: false },
    { name: "isTrap", value: false },
    { name: "text", value: "" }
  ]
};

export let store = createStore(
  combineReducers(
    Object.keys(initState).reduce((sum, cur) => {
      return { ...sum, ...reducer(initState[cur], cur) };
    }, {})
  ),
  compose(applyMiddleware(thunk, sagaMiddleware))
);

class ConstantSeries {
  constructor(prefix, initState) {
    initState[prefix].map(cur => {
      this[cur.name] = prefix + cur.name;
      return null;
    });
  }

  update(name, payload) {
    if (typeof name === "object" && name !== null) {
      for (let key in name) {
        store.dispatch({ type: "Update_" + this[key], payload: name[key] });
      }
    } else if (typeof name === "string") {
      store.dispatch({ type: "Update_" + this[name], payload });
    }
  }
}

function reducer(arr, name) {
  let r = {};

  arr.map(cur => {
    r[name + cur.name] = (state = cur.value, { type, payload }) => {
      switch (type) {
        case "Update_" + name + cur.name: {
          return payload;
        }
        default:
          return state;
      }
    };

    return null;
  });

  return r;
}

function rechyons(initState) {
  var r = {};
  for (let key in initState) {
    r[key] = new ConstantSeries(key, initState);
  }
  return r;
}

sagaMiddleware.run(rootSaga);

export default rechyons(initState);
