import { put, takeEvery, all, delay, select } from "redux-saga/effects";
import mystore from "./store";

export const toggleCustomAlert = "toggleCustomAlert";
export const toggleWriteStatusCollapsed = "toggleWriteStatusCollapsed";

export default function* rootSaga() {
  yield gen(
    function* toggleCustomAlert({ text }) {
      if (text) {
        yield put(mystore.customAlert.update("text", text));
      }

      let show = yield select(state => state[mystore.customAlert.show]);

      yield put(mystore.customAlert.update("show", !show));

      if (!show) {
        yield delay(100);
      }

      let isTrap = yield select(state => state[mystore.customAlert.isTrap]);

      yield put(mystore.customAlert.update("isTrap", !isTrap));
    },
    function* toggleWriteStatusCollapsed() {
      let writeStatusCollapsed = yield select(
        state => state[mystore.hyperDb.writeStatusCollapsed]
      );

      yield put(
        mystore.hyperDb.update("writeStatusCollapsed", !writeStatusCollapsed)
      );

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
