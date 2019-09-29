class ConstantSeries {
  constructor(prefix, constants) {
    this._constants = constants.reduce((sum, cur) => {
      sum[cur.name] = new Constant(prefix + cur.name, cur.value);
      return sum;
    }, {});
  }

  constant(name) {
    return this._constants[name];
  }

  reducer() {
    let r = {};
    for (var i in this._constants) {
      let c = this._constants[i];
      r[c.name] = reducer(c, c.value);
    }
    return r;
  }

  update(name, payload) {
    return { type: this._constants[name].update, payload };
  }
}

class Constant {
  constructor(name, value) {
    this._name = name;
    this._value = value;
  }
  get value() {
    return this._value;
  }
  get name() {
    return this._name;
  }
  get update() {
    return "Update_" + this._name;
  }
}

function reducer(base, init) {
  if (!base instanceof Constant) {
    throw new Error("Expected base type to be Constant");
  }

  return (state = init, { type, payload }) => {
    switch (type) {
      case base.update: {
        return payload;
      }
      default:
        return state;
    }
  };
}

export let hyperDb = new ConstantSeries("HyperDb", [
  { name: "Documents", value: [] },
  { name: "ShoppingList", value: [] },
  { name: "Key", value: null },
  { name: "Archive", value: null },
  { name: "Error", value: null },
  { name: "Authorized", value: null },
  { name: "LocalKeyCopied", value: null },
  { name: "DocTitle", value: null },
  { name: "Loading", value: false },
  { name: "WriteStatusCollapsed", value: true },
  { name: "LocalFeedLength", value: false },
  { name: "DocKey", value: null }
]);

export let netWork = new ConstantSeries("NetWork", [
  { name: "LastSync", value: [] },
  { name: "SyncedUploadLength", value: [] },
  { name: "SyncedDownloadLength", value: null },
  { name: "LocalUploadLength", value: null },
  { name: "LocalDownloadLength", value: null },
  { name: "CancelGReplication", value: null },
  { name: "Connecting", value: null },
  { name: "Connected", value: null },
  { name: "Status", value: null }
]);

export let app = new ConstantSeries("App", [
  { name: "DevMode", value: false },
  { name: "DevLabel", value: null },
  { name: "ServiceWorker", value: null }
]);

export let customAlert = new ConstantSeries("CustomAlert", [
  { name: "Show", value: false },
  { name: "IsTrap", value: false },
  { name: "Text", value: "" }
]);
