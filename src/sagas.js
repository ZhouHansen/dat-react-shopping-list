import { put, takeEvery, all, delay, select } from "redux-saga/effects";
import { customAlert, hyperDb } from "./constants";

export const toggleCustomAlert = "toggleCustomAlert";
export const toggleWriteStatusCollapsed = "toggleWriteStatusCollapsed";

export default function* rootSaga() {
  yield gen(
    function* toggleCustomAlert({ text }) {
      if (text) {
        yield put(customAlert.action("Text", "update", text));
      }

      let prevShow = yield select(
        state => state[customAlert.constant("Show").name]
      );

      yield put(customAlert.action("Show", "toggle"));

      if (!prevShow) {
        yield delay(100);
      }

      yield put(customAlert.action("IsTrap", "toggle"));
    },
    function* toggleWriteStatusCollapsed() {
      yield put(hyperDb.action("WriteStatusCollapsed", "toggle"));

      if (window) {
        let writeStatusCollapsed = yield select(
          state => state[hyperDb.constant("WriteStatusCollapsed").name]
        );

        console.log(writeStatusCollapsed);

        window.localStorage.setItem(
          "writeStatusCollapsed",
          writeStatusCollapsed
        );
      }
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
