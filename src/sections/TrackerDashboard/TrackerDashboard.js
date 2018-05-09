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

import { Grid, Form, Label, Table, Progress, Dimmer, Loader, Button, Popup, Header, Checkbox, List } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { fetchTrackers, updateSort, sortByOptions, directions, enableToggle } from './trackerDashboardData';

import './TrackerDashboard.css';

class TrackerDashboard extends Component {

  componentDidMount() {
    this.context.store.dispatch(fetchTrackers())
  }

  // Set up some defaults
  state = {
    showCompleted: false
  };

  handleShowCompletedToggle = (e, toggleProps) => {
    //TODO: dispatch fetch trackers with showCompleted
    this.setState({ showCompleted: toggleProps.checked });
  };

  handleSort(newSortBy, currentSortBy, currentDirection) {
    if(currentSortBy === newSortBy){
      if(currentDirection === directions.ascending){
        return this.props.onHandleSort(newSortBy, directions.descending)
      }
      else {
        return this.props.onHandleSort(newSortBy, directions.ascending)
      }
    }
    else {
      return this.props.onHandleSort(newSortBy, directions.ascending)
    }
  }

  render() {
    const { showCompleted } = this.state;

    const { dimTable, trackers, onHandleSort, sortBy, sortDirection, onHandleEnableToggle } = this.props;

    return (
      <div className="App">
        <Grid>
          {/* <Grid.Column width={4} />
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
          <Grid.Column width={4} /> */}

          <Grid.Column width={16}>
            <Dimmer active={dimTable} inverted>
              <Loader size="medium" />
            </Dimmer>

            <Table sortable basic="very" className="tracker-table">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    sorted={sortBy === sortByOptions.pipeline ? sortDirection : null}
                    onClick={() => this.handleSort(sortByOptions.pipeline, sortBy, sortDirection)}
                  >
                    Name
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortBy === sortByOptions.priority ? sortDirection : null}
                    onClick={() => this.handleSort(sortByOptions.priority, sortBy, sortDirection)}
                  >
                    Priority
                  </Table.HeaderCell>
                  <Table.HeaderCell
                    sorted={sortBy === sortByOptions.progress ? sortDirection : null}
                    onClick={() => this.handleSort(sortByOptions.progress, sortBy, sortDirection)}
                  >
                    Progress
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {trackers
                  .filter((tracker) => {
                    if (showCompleted) {
                      return true;
                    }
                    else{
                      const isCompleted = tracker.status === 'Complete'
                      return !isCompleted;
                    }
                  })
                  .map(({ 
                    // Core properties
                    pipelineName, priority, trackerPercent, filterId,
                    // History
                    createdOn , createUser, updateUser, updatedOn,
                    // Key
                    enabled,status,
                    // Misc
                    lastPollAge, taskCount, trackerMs,  streamCount, eventCount
                  }) => (
                    <Popup
                      key={pipelineName}
                      trigger={
                        <Table.Row >
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
                      }
                      flowing
                      hoverable
                      position='top center'
                      wide='very'
                    >
                      <Grid centered divided columns={3}>
                        <Grid.Column textAlign='left'>
                        <List>
                          <List.Item><Checkbox toggle label='Enabled?' checked={enabled} onMouseDown={() => onHandleEnableToggle(filterId, enabled)}/></List.Item>
                          <List.Item><em>status?</em>{status ? status : 'No status'}</List.Item>
                        </List>
                        </Grid.Column>
                        <Grid.Column textAlign='left'>
                          <p><em>lastPollAge: </em>{lastPollAge}</p>
                          <p><em>Task count: </em>{taskCount}</p>
                          <p><em>trackerMs: </em>{moment(trackerMs).calendar()}</p>
                          <p><em>streamCount: </em>{streamCount}</p>
                          <p><em>eventCount: </em>{eventCount}</p>
                        </Grid.Column>
                        <Grid.Column textAlign='left'>
                          <p><em>Created</em> by '{createUser}' {moment(createdOn).calendar().toLowerCase()}</p>
                          <p><em>Updated</em> by '{updateUser}' {moment(updatedOn).calendar().toLowerCase()}</p>                        </Grid.Column>
                      </Grid>
                    </Popup>
                    
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
  onHandleSort: PropTypes.func.isRequired,
  onHandleEnableToggle: PropTypes.func.isRequired
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
    },
    onHandleEnableToggle: (filterId, isCurrentlyEnabled) => {
      dispatch(enableToggle(filterId, isCurrentlyEnabled))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackerDashboard);
