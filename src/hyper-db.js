import hyperdrive from "@jimpick/hyperdrive-hyperdb-backend";
import rai from "random-access-idb";
import toBuffer from "to-buffer";
import crypto from "hypercore-crypto";
import { hyperDb, netWork } from "./constants";
import newId from "monotonic-timestamp-base36";
import dumpWriters from "./lib/dumpWriters";
import connectToGateway from "./lib/connectToGateway";
import history from "./history";
import { matchPath } from "react-router";
import { toggleCustomAlert, toggleWriteStatusCollapsed } from "./sagas";

export default function(store, indexedDb) {
  let dispatch = store.dispatch;

  return {
    updateDoc() {
      let path = matchPath(history.location.pathname, {
        path: "/doc/:doc",
        exact: true,
        strict: false
      });

      let docKey = path ? path.params.doc : null;

      dispatch(hyperDb.action("DocKey", "update", docKey));
      dispatch(hyperDb.action("ShoppingList", "update", []));
      dispatch(hyperDb.action("Error", "update", null));
      dispatch(hyperDb.action("Authorized", "update", null));
      dispatch(hyperDb.action("LocalKeyCopied", "update", false));
      dispatch(hyperDb.action("DocTitle", "update", ""));

      if (!docKey) {
        dispatch(hyperDb.action("Loading", "update", false));
        dispatch(hyperDb.action("Key", "update", null));
        dispatch(hyperDb.action("Archive", "update", null));
      } else {
        console.log(`Loading ${docKey}`);
        dispatch(hyperDb.action("LocalFeedLength", "update", null));
        indexedDb.fetchDocLastSync(docKey);
        let storage = rai(`doc-${docKey}`);
        let archive = hyperdrive(storage, docKey);
        dispatch(hyperDb.action("Loading", "update", true));
        archive.ready(() => {
          console.log("hyperdrive ready");
          console.log("Local key:", archive.db.local.key.toString("hex"));
          dumpWriters(archive);
          dispatch(hyperDb.action("Archive", "update", archive));
          dispatch(hyperDb.action("Key", "update", archive.key));
          let cancelGReplication = store.getState()[
            netWork.constant("CancelGReplication").name
          ];
          if (cancelGReplication) {
            cancelGReplication();
          }
          dispatch(
            netWork.action(
              "CancelGReplication",
              "update",
              connectToGateway(archive, updateSyncStatus, updateConnecting)
            )
          );
          readShoppingList();
          archive.db.watch(() => {
            console.log("Archive updated:", archive.key.toString("hex"));
            dumpWriters(archive);
            readShoppingList();
          });
        });
      }
    },

    createDoc(docName) {
      let { publicKey: key, secretKey } = crypto.keyPair();
      let keyHex = key.toString("hex");
      console.log("Create doc:", docName, keyHex);
      let storage = rai(`doc-${keyHex}`);
      let archive = hyperdrive(storage, key, { secretKey });
      archive.ready(() => {
        console.log("hyperdrive ready");
        dispatch(hyperDb.action("Key", "update", key));
        dispatch(hyperDb.action("Archive", "update", archive));
        let shoppingList = [
          "Rice",
          "Bananas",
          "Kale",
          "Avocados",
          "Bread",
          "Quinoa",
          "Beer"
        ];

        writeDatJson(() => {
          writeShoppingListItems(() => {
            console.log("Done");
            indexedDb.writeNewDocumentRecord(keyHex, docName);
          });
        });
        function writeDatJson(cb) {
          let json = JSON.stringify(
            {
              url: `dat://${keyHex}/`,
              title: docName,
              description: `Dat Shopping List demo - https://dat-shopping-list.glitch.me/`
            },
            null,
            2
          );
          archive.writeFile("dat.json", json, err => {
            if (err) throw err;
            cb();
          });
        }
        function writeShoppingListItems(cb) {
          let item = shoppingList.shift();
          if (!item) return cb();
          let json = JSON.stringify({
            name: item,
            bought: false,
            dateAdded: Date.now()
          });
          archive.writeFile(`/shopping-list/${newId()}.json`, json, err => {
            if (err) throw err;
            writeShoppingListItems(cb);
          });
        }
      });
    },

    toggleBought(itemFile) {
      let shoppingList = store.getState()[
        hyperDb.constant("ShoppingList").name
      ];

      let item = shoppingList.find(item => item.file === itemFile);

      let archive = store.getState()[hyperDb.constant("Archive").name];

      let json = JSON.stringify({
        name: item.name,
        bought: !item.bought,
        dateAdded: item.dateAdded
      });

      archive.writeFile(`/shopping-list/${item.file}`, json, err => {
        if (err) throw err;
        console.log(`Rewrote: ${item.file}`);
      });
    },

    addShoppingItem(name) {
      console.log("addItem", name);
      let archive = store.getState()[hyperDb.constant("Archive").name];

      const json = JSON.stringify({
        name,
        bought: false,
        dateAdded: Date.now()
      });

      const file = newId() + ".json";

      archive.writeFile(`/shopping-list/${file}`, json, err => {
        if (err) throw err;
        console.log(`Created: ${file}`);
      });
    },

    removeShoppingItem(itemFile) {
      let shoppingList = store.getState()[
        hyperDb.constant("ShoppingList").name
      ];

      let item = shoppingList.find(item => item.file === itemFile);

      let archive = store.getState()[hyperDb.constant("Archive").name];

      archive.unlink(`/shopping-list/${item.file}`, err => {
        if (err) throw err;
        console.log(`Unlinked: ${item.file}`);
      });
    },

    addLink(link) {
      const match = link.match(/([0-9a-fA-F]{64})\/?$/);

      if (match) {
        const key = match[1];
        history.push(`/doc/${key}`);
      } else {
        store.dispatch({
          type: toggleCustomAlert,
          text: "URL or key must contain a 64 character hex value"
        });
      }
    },

    authorize(writerKey) {
      if (!writerKey.match(/^[0-9a-f]{64}$/)) {
        store.dispatch({
          type: toggleCustomAlert,
          text: "Key must be a 64 character hex value"
        });

        return;
      }

      let archive = store.getState()[hyperDb.constant("Archive").name];

      archive.authorize(toBuffer(writerKey, "hex"), err => {
        if (err) {
          store.dispatch({
            type: toggleCustomAlert,
            text: "Error while authorizing: " + err.message
          });
        } else {
          console.log(`Authorized.`);
          store.dispatch({
            type: toggleCustomAlert,
            text: "Authorized new writer"
          });
        }
      });
    }
  };

  function updateSyncStatus(message) {
    let {
      key,
      connectedPeers,
      localUploadLength,
      remoteUploadLength,
      localDownloadLength,
      remoteDownloadLength
    } = message;
    let hyperDbKey = store.getState()[hyperDb.constant("Key").name];
    if (hyperDbKey && key !== hyperDbKey.toString("hex")) return;
    dispatch(netWork.action("Connected", "update", !!connectedPeers));
    let loading = store.getState()[hyperDb.constant("Loading").name];
    dispatch(
      netWork.action(
        "LocalUploadLength",
        "update",
        loading ? null : localUploadLength
      )
    );
    dispatch(
      netWork.action(
        "LocalDownloadLength",
        "update",
        loading ? null : localDownloadLength
      )
    );

    if (hyperDbKey && connectedPeers) {
      dispatch(netWork.action("Connecting", "update", false));
      dispatch(
        netWork.action("SyncedUploadLength", "update", remoteUploadLength)
      );
      dispatch(
        netWork.action("SyncedDownloadLength", "update", remoteDownloadLength)
      );
      indexedDb.updateDocLastSync({
        key,
        syncedUploadLength: remoteUploadLength,
        syncedDownloadLength: remoteDownloadLength
      });
    }
  }
  function updateConnecting(connecting) {
    dispatch(netWork.action("Connecting", "update", connecting));
  }
  function readShoppingList() {
    let archive = store.getState()[hyperDb.constant("Archive").name];
    let docKey = store.getState()[hyperDb.constant("DocKey").name];
    let shoppingList = [];

    archive.readdir("/shopping-list", (err, fileList) => {
      if (err) {
        error(err);
        return;
      }
      console.log("Shopping list files:", fileList.length);
      readTitleFromDatJson((err, title) => {
        if (err) {
          error(err);
          return;
        }
        readShoppingListFiles(err => {
          if (err) {
            error(err);
            return;
          }
          console.log("Done reading files.", title);
          updateAuthorized(err => {
            if (err) throw err;
            dispatch(hyperDb.action("Loading", "update", false));
            dispatch(hyperDb.action("DocTitle", "update", title));
            dispatch(hyperDb.action("ShoppingList", "update", shoppingList));
            indexedDb.writeNewDocumentRecord(docKey, title);
          });
        });
      });

      function error(err) {
        console.log("Error", err);
        dispatch(
          hyperDb.action("Error", "update", "Error loading shopping list")
        );
      }

      function readTitleFromDatJson(cb) {
        archive.readFile("dat.json", "utf8", (err, contents) => {
          if (err) {
            console.error("dat.json error", err);
            return cb(null, "Unknown");
          }
          if (!contents) return cb(null, "Unknown");
          try {
            const metadata = JSON.parse(contents);
            cb(null, metadata.title);
          } catch (e) {
            console.error("Parse error", e);
            cb(null, "Unknown");
          }
        });
      }

      function readShoppingListFiles(cb) {
        const file = fileList.shift();
        if (!file) return cb();
        archive.readFile(`/shopping-list/${file}`, "utf8", (err, contents) => {
          if (err) return cb(err);
          try {
            const item = JSON.parse(contents);
            item.file = file;
            shoppingList.push(item);
          } catch (e) {
            console.error("Parse error", e);
          }
          readShoppingListFiles(cb);
        });
      }
    });
  }
  function updateAuthorized(cb) {
    let authorized = store.getState()[hyperDb.constant("Authorized").name];
    if (authorized) return cb();
    const db = store.getState()[hyperDb.constant("Archive").name].db;
    console.log("Checking if local key is authorized");
    db.authorized(db.local.key, (err, newAuthorized) => {
      if (err) {
        return cb(err);
      }
      console.log("Authorized status:", newAuthorized);
      if (
        authorized === false &&
        newAuthorized === true &&
        store.getState()[hyperDb.constant("WriteStatusCollapsed").name]
      ) {
        dispatch({ type: toggleWriteStatusCollapsed });
      }
      dispatch(hyperDb.action("Authorized", "update", newAuthorized));
      cb();
    });
  }
}
