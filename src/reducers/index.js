import { combineReducers } from "redux";

import * as cs from "../constants.js";

let reducers = {
  ...cs.hyperDb.reducer(),
  ...cs.netWork.reducer(),
  ...cs.app.reducer(),
  ...cs.customAlert.reducer()
};

export default combineReducers(reducers);
