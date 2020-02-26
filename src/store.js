import createSagaMiddleware from "redux-saga";
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import rootSaga from "./sagas";

import rechyons from "rechyons";

let sagaMiddleware = createSagaMiddleware();

let initState = {
  hyperDb: {
    documents: [],
    shoppingList: [],
    key: null,
    archive: null,
    error: null,
    authorized: null,
    localKeyCopied: null,
    docTitle: null,
    loading: false,
    writeStatusCollapsed: true,
    localFeedLength: false,
    docKey: null
  },
  netWork: {
    lastSync: [],
    syncedUploadLength: [],
    syncedDownloadLength: null,
    localUploadLength: null,
    localDownloadLength: null,
    cancelGReplication: null,
    connecting: null,
    connected: null,
    status: null
  },
  app: {
    devMode: false,
    devLabel: null,
    serviceWorker: null
  },
  customAlert: {
    show: false,
    isTrap: false,
    text: ""
  }
};

export let store = createStore(
  combineReducers(rechyons.reducer(initState)),
  compose(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

export default rechyons(initState, store.dispatch);
