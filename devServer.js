import express from "express";
import expressWebSocket from "express-ws";
import os from "os";
import { cleanup, cb } from "./websocket";

let app = express();

let router = express.Router();

let server = app.listen(3300, getNetworkAddress());

expressWebSocket(router, server, {
  perMessageDeflate: false
});

cleanup();

router.ws("/archive/:key", cb);

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
