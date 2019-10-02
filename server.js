import express from "express";
import expressWebSocket from "express-ws";
import { cleanup, cb } from "./websocket";
import path from "path";

let app = express();

expressWebSocket(app);

cleanup();

app.use(express.static("./build"));

app.ws("/archive/:key", cb);

// for client side render
// e.g. refresh http://youserver/somelink without it will return 404
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname + "/build/index.html"));
});

app.listen(3000, () => console.log(`Example app listening on port 3000!`));
