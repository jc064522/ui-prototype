/*
 * Copyright 2018 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import moment from 'moment';

import { Grid, Form, Label, Table, Progress, Dimmer, Loader } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { fetchTrackers, updateSort } from './trackerDashboardData';

import './TrackerDashboard.css';

class TrackerDashboard extends Component {

  // Set up some defaults
  state = {
    showCompleted: false,
    column: 'progress',
    direction: 'descending'
  };

  handleShowCompletedToggle = (e, toggleProps) => {
    //TODO: dispatch fetch trackers with showCompleted
    this.setState({ showCompleted: toggleProps.checked });
  };

  render() {
    const {
      column, direction, showCompleted,
    } = this.state;

    const { dimTable, trackers, onHandleSort, sortBy, sortDirection } = this.props;

    return (
      <div className="App">
        <Grid>
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
                <Form.Input
                  icon="search"
                  iconPosition="left"
                  placeholder="Filter by name..."
                  onChange={this.handleFilterByNameChange}
                />
              </Form.Group>
            </Form>
          </Grid.Column>
          <Grid.Column width={4} />

          <Grid.Column width={16}>
            <Dimmer active={dimTable} inverted>
              <Loader size="medium" />
            </Dimmer>

            <Table sortable basic="very" className="tracker-table">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    sorted={sortBy === 'Pipeline' ? sortDirection : null}
                    onClick={() => {
                      if(sortBy === 'Pipeline'){
                        if(sortDirection === 'ascending'){
                          return onHandleSort('Pipeline', 'descending')
                        }
                        else {
                          return onHandleSort('Pipeline', 'ascending')
                        }
                      }
                      else {
                        return onHandleSort('Pipeline', 'ascending')
                      }
                    }}
                  >
                    Name
                  </Table.HeaderCell>
                  {/* <Table.HeaderCell
                    sorted={column === 'priority' ? direction : null}
                    onClick={this.handleSort('priority')}
                  >
                    Priority
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={column === 'progress' ? direction : null}
                    onClick={this.handleSort('progress')}
                  >
                    Progress
                  </Table.HeaderCell> */}
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {trackers
                  .filter((tracker) => {
                    if (showCompleted) {
                      return true;
                    }
                    else{
                      const isCompleted = tracker.status === 'complete'
                      return !isCompleted;
                    }
                  })
                  .map(({ pipelineName, priority, trackerPercent }) => (
                    <Table.Row key={pipelineName}>
                      <Table.Cell className="name-column" textAlign="right" width={7}>
                        {pipelineName}
                      </Table.Cell>
                      <Table.Cell className="priority-column" textAlign="center" width={1}>
                        <Label circular color="green">
                          {priority}
                        </Label>
                      </Table.Cell>
                      <Table.Cell className="progress-column" width={8}>
                        <Progress percent={trackerPercent} indicating />
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

TrackerDashboard.contextTypes = {
  store: PropTypes.object.isRequired,
};

TrackerDashboard.propTypes = {
  onHandleSort: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  dimTable: state.trackerDashboard.isLoading,
  trackers: state.trackerDashboard.trackers,
  showCompleted: state.trackerDashboard.showCompleted,
  sortBy: state.trackerDashboard.sortBy,
  sortDirection: state.trackerDashboard.sortDirection
});

const mapDispatchToProps = dispatch => {
  return {
    onHandleSort: (sortBy, sortDirection) => {
      dispatch(updateSort({sortBy, sortDirection}))
      dispatch(fetchTrackers())
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackerDashboard);
