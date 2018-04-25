import React, { Component } from "react";
import "./App.css";
import { Grid, Segment, List, Accordion, Form, Label } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import TrackerSummary from "./TrackerSummary";

const dummyTrackers = [
  {
    name: "FANTASTIC_PIPELINE_ALL_CAPS_FOR_SOME_REASON",
    trackerMs: "2018-01-02 12:34:34",
    trackerPercentage: 76,
    lastPollAge:6.1,
    completed:false,
    enabled:true,
    priority:5
  },
  {
    name: "FANTASTIC_PIPELINE_2",
    trackerMs: "2018-04-02 12:34:34",
    trackerPercentage: 1,
    lastPollAge:1,
    completed:false,
    enabled:true,
    priority:10
  },
  {
    name: "FANTASTIC_PIPELINE_3",
    trackerMs: "2018-01-02 12:34:34",
    trackerPercentage: 100,
    lastPollAge:300,
    completed:true,
    enabled:false,
    priority:10
  }
];

const sortOptions = [
  { key: "trackerMs", value: "trackerMs", text: "Created tasks up to" },
  { key: "trackerPercentage", value: "trackerPercentage", text: "Percentage complete" },
  { key: "lastPollAge", value: "lastPollAge", text: "Last polled" },
];

const sortDirectionOptions = [
  { key: "asc", value: "asc", text: "Ascending" },
  { key: "desc", value: "desc", text: "Descending" },
];


class App extends Component {
  state = { showCompleted: false, orderBy: 'trackerMs', sortDirection:'asc'}

  handleShowCompletedToggle = (e, toggleProps) => {
    this.setState({showCompleted: toggleProps.checked})
  }

  handleSortChange = (e, orderDropdownProps) => {
    this.setState({orderBy: orderDropdownProps.value})
  }

  handleSortDirectionChange = (e, sortDirectionDropdownProps) => {
    this.setState({sortDirection: sortDirectionDropdownProps.value})
  }

  render() {
    const trackers = dummyTrackers;
    const { showCompleted, orderBy, sortDirection } = this.state
    return <div className="App">
        <Grid>
          <Grid.Column width={16}>
            <header className="App-header">
              <h1 className="App-title">Stroom</h1>
            </header>
          </Grid.Column>
          <Grid.Column width={4} />
          <Grid.Column width={8}>
            <Form>
              <Form.Group inline>
              <Form.Checkbox inline label="Show completed?" toggle onChange={this.handleShowCompletedToggle} />
              <Form.Dropdown inline compact label="Sort by" labeled options={sortOptions} value={orderBy} onChange={this.handleSortChange}/>
              <Form.Dropdown inline compact label="Sort direction" labeled options={sortDirectionOptions} value={sortDirection} onChange={this.handleSortDirectionChange}/>
              </Form.Group>
            </Form>
          </Grid.Column>
          <Grid.Column width={4} />
          <Grid.Column width={16}>
            <Segment.Group className="trackers-container" size="mini">
              {trackers
                .filter(tracker => tracker.completed === showCompleted || !tracker.completed)
                .sort((tracker1, tracker2) => {
                  if(orderBy === 'trackerMs'){
                    if(sortDirection === 'asc'){
                      return tracker1.trackerMs > tracker2.trackerMs
                    }
                    else {
                      return tracker1.trackerMs < tracker2.trackerMs
                    }
                  }
                  else if(orderBy === 'trackerPercentage'){
                    if(sortDirection === 'asc'){
                      return tracker1.trackerPercentage > tracker2.trackerPercentage
                    }
                    else {
                      return tracker1.trackerPercentage < tracker2.trackerPercentage
                    }
                  }
                  else if(orderBy === 'lastPollAge'){
                    if(sortDirection === 'asc'){
                      return tracker1.lastPollAge > tracker2.lastPollAge
                    }
                    else {
                      return tracker1.lastPollAge < tracker2.lastPollAge
                    }
                  }
                })
                .map((tracker, i) => {
                  return <TrackerSummary tracker={tracker} key={i} />;
                })}
            </Segment.Group>
          </Grid.Column>
        </Grid>
      </div>;
  }
}

export default App;
