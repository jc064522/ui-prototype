import React, { Component } from "react";
import "./App.css";
import { Grid, Segment, List, Accordion, Form, Label } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import TrackerSummary from "./TrackerSummary";

const dummyTrackers = [
  {
    name: "FANTASTIC_PIPELINE_ALL_CAPS_FOR_SOME_REASON",
    trackerMs: "2018-01-02 12:34:34",
    trackerPercentage: "76",
    completed:false
  },
  {
    name: "FANTASTIC_PIPELINE_2",
    trackerMs: "2018-04-02 12:34:34",
    trackerPercentage: "1",
    completed:false
  },
  {
    name: "FANTASTIC_PIPELINE_3",
    trackerMs: "2018-01-02 12:34:34",
    trackerPercentage: "100",
    completed:true
  }
];

class App extends Component {
  state = { showCompleted: false}

  handleShowCompletedToggle = (e, toggleProps) => {
    this.setState({showCompleted: toggleProps.checked})
  }

  render() {
    const trackers = dummyTrackers;
    const { showCompleted } = this.state
    return (
      <div className="App">
        <Grid>
          <Grid.Column width={16}>
            <header className="App-header">
              <h1 className="App-title">Stroom</h1>
            </header>
          </Grid.Column>
          <Grid.Column width={4} />
          <Grid.Column width={8}>
            <Form>
              <Form.Checkbox inline label="Show completed?" toggle onChange={this.handleShowCompletedToggle}/>
            </Form>
          </Grid.Column>
          <Grid.Column width={4} />
          <Grid.Column width={16}>
            <Segment.Group className="trackers-container" size="mini">
              {trackers
              .filter((tracker) => tracker.completed === showCompleted || !tracker.completed)
              .map((tracker, i) => {
                return <TrackerSummary tracker={tracker} key={i} />;
              })}
            </Segment.Group>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default App;
