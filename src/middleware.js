
import { applyMiddleware, compose } from "redux";
import { routerMiddleware } from "react-router-redux";
import thunk from "redux-thunk";
import createHistory from "history/createBrowserHistory";
import logger from "redux-logger";

const enhancers = [];
if (process.env.NODE_ENV === "development") {
  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === "function") {
    enhancers.push(devToolsExtension());
  }
}

export const history = createHistory();

export default compose(
  applyMiddleware(thunk, routerMiddleware(history), logger),
  ...enhancers
)
