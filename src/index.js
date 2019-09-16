import { Router } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import history from "./history";
import Providers from "./providers";

ReactDOM.render(
  <Router history={history}>
    <Providers></Providers>
  </Router>,

  document.getElementById("root")
);
