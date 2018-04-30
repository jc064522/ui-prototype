import React, { Component } from "react";

import { Link } from "react-router-dom";

class Home extends Component {
  render() {
    return (
      <div>
        <h1> Dafuk? </h1>
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
        </div>
      </div>
    );
  }
}

export default Home;
