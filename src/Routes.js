import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";

import Home from "pages/Home";
import OriginalList from "pages/OriginalList";
import Graph from "pages/Graph";

const Routes = () => (
  <BrowserRouter>
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/original_list">Original List</Link>
        </li>
        <li>
          <Link to="/graph">Graph</Link>
        </li>
      </ul>

      <hr />

      <Route exact path="/" component={Home} />
      <Route path="/original_list" component={OriginalList} />
      <Route path="/graph" component={Graph} />
    </div>
  </BrowserRouter>
)

export default Routes;
