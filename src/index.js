import React from "react";
import ReactDOM, { render } from "react-dom";
import { Provider } from "react-redux";
import { ConnectedRouter } from "react-router-redux";

import Routes from "./Routes";
import registerServiceWorker from "./registerServiceWorker";
import store, { history } from "./store";

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>,
  document.getElementById("root")
);

registerServiceWorker();
