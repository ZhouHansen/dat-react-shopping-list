import { Router } from "react-router-dom";
import React from "react";
import { hydrate } from "react-dom";
import "./client.css";
import history from "./history";

import Providers from "./providers";

hydrate(
  <Router history={history}>
    <Providers></Providers>
  </Router>,

  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}
