import thunky from "thunky";
import crypto from "hypercore-crypto";
import { netWork, hyperDb } from "./constants";
import history from "./history";

export default function(store) {
  let dispatch = store.dispatch;
  let ready = thunky(openDocumentsDB);
  let db = null;

  function openDocumentsDB(cb) {
    let request = window.indexedDB.open("documents", 2);
    request.onerror = function(event) {
      console.log("IndexedDB error");
    };
    request.onsuccess = function(event) {
      db = event.target.result;
      readDoc(cb);
    };
    request.onupgradeneeded = function(event) {
      console.log("IndexedDB upgrade");
      let db = event.target.result;
      let objectStore;
      if (event.oldVersion === 0) {
        objectStore = db.createObjectStore("documents", { keyPath: "key" });
        objectStore.createIndex("name", "name");
      } else {
        objectStore = event.target.transaction.objectStore("documents");
      }
      objectStore.createIndex("dateAdded", "dateAdded");
      objectStore.transaction.oncomplete = function(event) {
        console.log("Document db created");
      };
    };
  }

  function readDoc(cb) {
    if (!db) return;
    let objectStore = db.transaction("documents").objectStore("documents");
    let index = objectStore.index("dateAdded");
    let documents = [];
    index.openCursor().onsuccess = function(event) {
      let cursor = event.target.result;
      if (cursor) {
        documents.push(cursor.value);
        cursor.continue();
      } else {
        dispatch(hyperDb.action("Documents", "update", documents));
        if (cb) cb();
      }
    };
  }

  function createDoc() {
    if (!db) return;
    let request = db
      .transaction("documents", "readwrite")
      .objectStore("documents")
      .add({
        key: crypto.keyPair().publicKey.toString("hex"),
        name: "abc",
        dateAdded: Date.now()
      });
    request.onsuccess = function(event) {
      console.log("documents reloaded");
      readDoc();
    };
    request.onerror = function(err) {
      console.log(err);
    };
  }

  function writeNewDocumentRecord(key, name, cb) {
    if (!db) return;
    let request = db
      .transaction("documents", "readwrite")
      .objectStore("documents")
      .add({
        key,
        name,
        dateAdded: Date.now(),
        lastSync: null,
        syncedUploadLength: 0,
        syncedDownloadLength: 0
      });
    request.onsuccess = function(event) {
      readDoc(() => {
        console.log("documents reloaded");
        cb();
      });
    };
    request.onerror = function(err) {
      cb(err);
    };
  }

  function fetchDocLastSync(key) {
    let objectStore = db
      .transaction("documents", "readwrite")
      .objectStore("documents");
    let request = objectStore.get(key);
    request.onsuccess = function(event) {
      let data = event.target.result;
      if (!data) return;
      dispatch(netWork.action("LastSync", "update", data.lastSync));
      dispatch(
        netWork.action("SyncedUploadLength", "update", data.syncedUploadLength)
      );
      dispatch(
        netWork.action(
          "SyncedDownloadLength",
          "update",
          data.syncedDownloadLength
        )
      );
    };
    request.onerror = function(event) {
      console.error("fetchDocLastSync error", event);
    };
  }

  function deleteCurrentDoc() {
    let keyHex = history.location.pathname.split("/").pop();
    deleteDoc(keyHex, err => {
      if (err) throw err;
      console.log("Doc deleted", keyHex);
      history.push(`/`);
    });
  }

  function deleteDoc(key, cb) {
    const request = db
      .transaction("documents", "readwrite")
      .objectStore("documents")
      .delete(key);
    request.onsuccess = function(event) {
      // Note: Deleting db doesn't return success ... probably because it's
      // still in use? It appears that it still gets cleaned up.
      window.indexedDB.deleteDatabase(`doc-${key}`);
      readDoc(() => {
        console.log("documents reloaded");
        cb();
      });
    };
    request.onerror = function(err) {
      cb(err);
    };
  }

  let idbApi = {
    ready() {
      ready(function() {});
    },

    deleteCurrentDoc() {
      ready(function() {
        deleteCurrentDoc();
      });
    },

    createDoc() {
      ready(function() {
        createDoc();
      });
    },

    writeNewDocumentRecord(key, name) {
      ready(function() {
        let documents = store.getState()[hyperDb.constant("Documents").name];
        if (documents.find(doc => doc.key === key)) return;
        writeNewDocumentRecord(key, name, err => {
          if (err) {
            throw err;
          }
          history.push(`/doc/${key}`);
        });
      });
    },

    fetchDocLastSync(key) {
      dispatch(netWork.action("LastSync", "update", null));
      dispatch(netWork.action("SyncedUploadLength", "update", null));
      dispatch(netWork.action("SyncedDownloadLength", "update", null));
      dispatch(netWork.action("LocalUploadLength", "update", null));
      dispatch(netWork.action("LocalDownloadLength", "update", null));

      ready(function() {
        fetchDocLastSync(key);
      });
    },

    updateDocLastSync({ key, syncedUploadLength, syncedDownloadLength }) {
      ready(function() {
        let objectStore = db
          .transaction("documents", "readwrite")
          .objectStore("documents");
        let request = objectStore.get(key);
        request.onsuccess = function(event) {
          const data = event.target.result;
          if (!data) return;
          data.syncedUploadLength = syncedUploadLength;
          data.syncedDownloadLength = syncedDownloadLength;
          data.lastSync = Date.now();
          const requestUpdate = objectStore.put(data);
          requestUpdate.onerror = function(event) {
            console.error("updateDocLastSync update error", event);
          };
        };
        request.onerror = function(event) {
          console.error("updateDocLastSync error", event);
        };
      });
    }
  };

  return idbApi;
}
