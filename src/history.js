import { createBrowserHistory, createMemoryHistory } from "history";

let history =
  typeof window === "undefined"
    ? createMemoryHistory()
    : createBrowserHistory();

export default history;
