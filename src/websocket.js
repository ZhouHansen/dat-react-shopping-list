import express from "express";
import expressWebSocket from "express-ws";
import websocketStream from "websocket-stream/stream";
import ram from "random-access-memory";
import hyperdrive from "@jimpick/hyperdrive-hyperdb-backend";
import hyperdiscovery from "hyperdiscovery";
import pump from "pump";
import dumpWriters from "./lib/dumpWriters";
import os from "os";

let app = express();

let router = express.Router();

let server = app.listen(3300, getNetworkAddress());

let maxArchives = 100;
let archives = {};

expressWebSocket(router, server, {
  perMessageDeflate: false
});

setInterval(function cleanup() {
  const sortedArchives = Object.values(archives).sort(
    (a, b) => a.lastAccess - b.lastAccess
  );
  sortedArchives.forEach((entry, index) => {
    const { archive, lastAccess, clients } = entry;
    const key = archive.key && archive.key.toString("hex");
    const peers = archive.db.source.peers.length;
    console.log(
      `  ${index} ${lastAccess} ${key} (${clients} clients, ${peers} peers)`
    );
  });
  if (sortedArchives.length > maxArchives) {
    for (let i = 0; i < sortedArchives.length - maxArchives; i++) {
      const archive = sortedArchives[i].archive;
      const key = archive.key && archive.key.toString("hex");
      console.log(`Releasing ${i} ${key}`);
      sortedArchives[i].cancel();
    }
  }
}, 60 * 1000);

router.ws("/archive/:key", (ws, req) => {
  let archiveKey = req.params.key;
  console.log("Websocket initiated for", archiveKey);
  let archive;
  if (archives[archiveKey]) {
    archive = archives[archiveKey].archive;
    archives[archiveKey].lastAccess = Date.now();
  } else {
    archive = hyperdrive(ram, archiveKey);
    archives[archiveKey] = {
      archive,
      lastAccess: Date.now(),
      cancel,
      clients: 0
    };
    archive.on("ready", () => {
      console.log("archive ready");
      // Join swarm
      const sw = hyperdiscovery(archive);
      archives[archiveKey].swarm = sw;
      sw.on("connection", (peer, info) => {
        console.log("Swarm connection", info);
      });
      const watcher = archive.db.watch(() => {
        console.log("Archive updated:", archive.key.toString("hex"));
        dumpWriters(archive);
      });
      watcher.on("error", err => {
        console.error("Watcher error", err);
      });
    });
  }
  archive.ready(() => {
    archives[archiveKey].clients += 1;
    const stream = websocketStream(ws);
    pump(
      stream,
      archive.replicate({ encrypt: false, live: true }),
      stream,
      err => {
        console.log("pipe finished for " + archiveKey, err && err.message);
        archives[archiveKey].clients -= 1;
      }
    );
  });

  function cancel() {
    console.log(`Cancelling ${archiveKey}`);
    const sw = archives[archiveKey].swarm;
    if (sw) sw.close();
    archive.db.source.peers.forEach(peer => peer.end());
    delete archives[archiveKey];
  }
});

function getNetworkAddress() {
  const interfaces = os.networkInterfaces();
  for (var name of Object.keys(interfaces)) {
    for (var interf of interfaces[name]) {
      const { address, family, internal } = interf;
      if (family === "IPv4" && !internal) {
        return address;
      }
    }
  }
}
