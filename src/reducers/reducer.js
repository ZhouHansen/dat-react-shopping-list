import * as cs from "../constants.js";

export default function(base, init = false) {
  if (!base instanceof cs.Constant) {
    throw new Error("Expected base type to be ConstCrud");
  }

  return (state = init, { type, payload }) => {
    switch (type) {
      case base.toggle: {
        return !state;
      }
      case base.update: {
        return payload;
      }
      case base.add: {
        state.push(payload);
        return state;
      }
      default:
        return state;
    }
  };
}
