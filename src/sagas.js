import { put, takeEvery, all, delay, select } from "redux-saga/effects";
import { customAlert, hyperDb } from "./store";

export const toggleCustomAlert = "toggleCustomAlert";
export const toggleWriteStatusCollapsed = "toggleWriteStatusCollapsed";

export default function* rootSaga() {
  yield gen(
    function* toggleCustomAlert({ text }) {
      if (text) {
        yield put(customAlert.update("Text", text));
      }

      let show = yield select(
        state => state[customAlert.constant("Show").name]
      );

      yield put(customAlert.update("Show", !show));

      if (!show) {
        yield delay(100);
      }

      let isTrap = yield select(
        state => state[customAlert.constant("IsTrap").name]
      );

      yield put(customAlert.update("IsTrap", !isTrap));
    },
    function* toggleWriteStatusCollapsed() {
      let writeStatusCollapsed = yield select(
        state => state[customAlert.constant("IsTrap").name]
      );

      yield put(hyperDb.update("WriteStatusCollapsed", !writeStatusCollapsed));

      window.localStorage.setItem(
        "writeStatusCollapsed",
        !writeStatusCollapsed
      );
    }
  );
}

function gen() {
  var args = [].slice.call(arguments);
  return all(
    args.map(arg => {
      return (function*() {
        yield takeEvery(arg.name, arg);
      })();
    })
  );
}
