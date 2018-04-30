import React, { Component } from "react";
import moment from "moment";
import "./Graph.css";
import {
  Grid,
  Segment,
  List,
  Accordion,
  Form,
  Label,
  Button,
  Table,
  Progress
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";

// import Tracker from "./Tracker";

const dummyTrackers = [
  {
    name: "FANTASTIC_PIPELINE_ALL_CAPS_FOR_SOME_REASON",
    trackerMs: moment()
      .subtract(4, "hours")
      .toISOString(),
    progress: 76,
    lastPollAge: 6.1,
    completed: false,
    enabled: true,
    priority: 5
  },
  {
    name: "FANTASTIC_PIPELINE_2",
    trackerMs: moment()
      .subtract(3, "days")
      .toISOString(),
    progress: 1,
    lastPollAge: 1,
    completed: false,
    enabled: true,
    priority: 18
  },
  {
    name: "FANTASTIC_PIPELINE_3",
    trackerMs: moment()
      .subtract(18, "hours")
      .toISOString(),
    progress: 100,
    lastPollAge: 300,
    completed: true,
    enabled: false,
    priority: 10
  }
];

// const sortOptions = [
//   { key: "trackerMs", value: "trackerMs", text: "Created tasks up to" },
//   {
//     key: "trackerPercentage",
//     value: "trackerPercentage",
//     text: "Percentage complete"
//   },
//   { key: "lastPollAge", value: "lastPollAge", text: "Last polled" }
// ];

// const sortDirectionOptions = [
//   { key: "asc", value: "asc", text: "Ascending" },
//   { key: "desc", value: "desc", text: "Descending" }
// ];

class Graph extends Component {
  // Set up some defaults
  state = {
    showCompleted: false,
    // orderBy: "trackerMs",
    // sortDirection: "desc",
    data: dummyTrackers,
    column: 'progress',
    direction: 'descending'
  };

  handleShowCompletedToggle = (e, toggleProps) => {
    this.setState({ showCompleted: toggleProps.checked });
  };

  // handleSortChange = (e, orderDropdownProps) => {
  //   this.setState({ orderBy: orderDropdownProps.value });
  // };

  // handleSortDirectionChange = (e, sortDirectionDropdownProps) => {
  //   this.setState({ sortDirection: sortDirectionDropdownProps.value });
  // };

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        // data: _sortBy(data, [clickedColumn]),
        data: data.sort((l, r) => l[clickedColumn] > r[clickedColumn]),
        direction: "ascending"
      });

      return;
    }

    this.setState({
      data: data.reverse(),
      direction: direction === "ascending" ? "descending" : "ascending"
    });
  };

  render() {
    const trackers = dummyTrackers;
    const { showCompleted, orderBy, sortDirection } = this.state;
    const { column, data, direction } = this.state;

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
              <Form.Group inline>
                <Form.Checkbox
                  inline
                  label="Include completed?"
                  toggle
                  onChange={this.handleShowCompletedToggle}
                />
              </Form.Group>
            </Form>
          </Grid.Column>
          <Grid.Column width={4} />

          <Grid.Column width={16}>
            <Table sortable basic="very" className="tracker-table">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    sorted={column === "name" ? direction : null}
                    onClick={this.handleSort("name")}
                  >
                    Name
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === "priority" ? direction : null}
                    onClick={this.handleSort("priority")}
                  >
                    Priority
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === "progress" ? direction : null}
                    onClick={this.handleSort("progress")}
                  >
                    Progress
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {data
                  .filter(tracker => {
                    if(showCompleted){
                      return true;
                    }
                    else {
                      return !tracker.completed
                    }
                  })
                  .map(({ name, priority, progress }) => (
                  <Table.Row>
                    <Table.Cell className="name-column" textAlign="right" width={7}>
                      {name}
                    </Table.Cell>
                    <Table.Cell className="priority-column" textAlign="center" width={1}>
                      <Label circular color="green">
                        {priority}
                      </Label>
                    </Table.Cell>
                    <Table.Cell className="progress-column" width={8}>
                      <Progress percent={progress} indicating />
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Graph;
