import React, { Component } from "react";
import {
  Grid,
  Segment,
  List,
  Accordion,
  Form,
  Label,
  Button
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Home from "pages/Home";
import OriginalList from "pages/OriginalList";
import Graph from "pages/Graph";

const Routes = () => (
  <Router>
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
  </Router>
)

export default Routes;
