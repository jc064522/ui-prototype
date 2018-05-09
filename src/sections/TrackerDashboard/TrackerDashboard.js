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
import Mousetrap from 'mousetrap'

import moment from 'moment';

import { Grid, Form, Label, Table, Progress, Dimmer, Loader, Button, Popup, Header, Checkbox, List, Segment, Modal, Card } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { fetchTrackers, updateSort, sortByOptions, directions, enableToggle, updateTrackerSelection } from './trackerDashboardData';

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

    const { dimTable, trackers, onHandleSort, sortBy, sortDirection, onHandleEnableToggle, selectedTrackerId, onHandleTrackerSelection } = this.props;

    const selectedTracker = trackers.find(tracker => tracker.filterId === selectedTrackerId)
    const showDetails = selectedTracker !== undefined

    // Set up hotkeys because anything else would be nasty
    if(showDetails){
      Mousetrap.bind('esc', () => onHandleTrackerSelection(undefined));
    }
    else{
      Mousetrap.unbind('esc');
    }

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

            <Dimmer.Dimmable blurring dimmed={showDetails}>
              <Dimmer inverted active={showDetails} onClickOutside={() => onHandleTrackerSelection(undefined)}>
                {selectedTracker ? (
                  <div className='details-container'>
                  <Card.Group centered className='details-content'>
                  <Card fluid>
                    <Card.Content>
                      {/* <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' /> */}
                      <Card.Header>
                        <Table className="tracker-details-table">
                        <Table.Body>
                      <Table.Row className="tracker-row"  >
                              <Table.Cell className="name-column" textAlign="right" width={7}>
                                {selectedTracker.pipelineName}
                              </Table.Cell>
                              <Table.Cell className="priority-column" textAlign="center" width={1}>
                                <Label circular color="green">
                                  {selectedTracker.priority}
                                </Label>
                              </Table.Cell>
                              <Table.Cell className="progress-column" width={8}>
                                <Progress percent={selectedTracker.trackerPercent} indicating />
                              </Table.Cell>
                            </Table.Row>
                            </Table.Body>
                            </Table>
                      </Card.Header>


                      <Card.Meta>
                        This tracker:
                      </Card.Meta>
                      <Card.Description>
                        <Grid centered divided columns={3}>
                          <Grid.Column textAlign='left'>
                            <List bulleted>
                              <List.Item>has a <strong>last poll age</strong> of {selectedTracker.lastPollAge}</List.Item>
                              <List.Item>has a <strong>task count</strong> of {selectedTracker.taskCount}</List.Item>
                              <List.Item>was <strong>last active</strong> {moment(selectedTracker.trackerMs).calendar().toLowerCase()}</List.Item>
                            </List>
                          </Grid.Column>
                          <Grid.Column>
                            <List bulleted>
                              <List.Item>{selectedTracker.status ? 'has a' : 'does not have a'} <strong>status</strong>{selectedTracker.status ? ' of ' + selectedTracker.status : undefined}</List.Item>
                              <List.Item>
                              {selectedTracker.streamCount ? 'has a' : 'does not have a'} <strong>stream count</strong>{selectedTracker.streamCount ? ' of ' + selectedTracker.streamCount : undefined}</List.Item>
                              <List.Item>{selectedTracker.eventCount ? 'has an' : 'does not have an'} <strong>event count</strong>{selectedTracker.eventCount ? ' of ' + selectedTracker.eventCount : undefined}</List.Item>
                            </List>

                          </Grid.Column>
                          <Grid.Column textAlign='left'>
                            <List bulleted>
                              <List.Item>was <strong>created</strong> by '{selectedTracker.createUser}' {moment(selectedTracker.createdOn).calendar().toLowerCase()}</List.Item>
                              <List.Item>was <strong>updated</strong> by '{selectedTracker.updateUser}' {moment(selectedTracker.updatedOn).calendar().toLowerCase()}</List.Item>
                            </List> 
                          </Grid.Column>
                        </Grid>
                      </Card.Description>
                    </Card.Content>
                  <Card.Content extra>
                    <Grid>
                      <Grid.Column width={8}>
                    <Checkbox toggle label='Enabled?' checked={selectedTracker.enabled} onMouseDown={() => onHandleEnableToggle(selectedTracker.filterId, selectedTracker.enabled)}/>
                    </Grid.Column>  
                      <Grid.Column width={8}>
                      <Button basic color='green' onClick={() => onHandleTrackerSelection(undefined)}>OK</Button>
                      </Grid.Column>
                    </Grid>
                  </Card.Content>

                </Card>
     </Card.Group>
                </div>)
                :(undefined)}
              </Dimmer>



              <Table selectable sortable basic="very" className="tracker-table">
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

                          <Table.Row key={filterId} className="tracker-row"  onClick={() => onHandleTrackerSelection(filterId)}>
                            <Table.Cell className="name-column" textAlign="right" width={7}>
                              {pipelineName}
                            </Table.Cell>
                            <Table.Cell className="priority-column" textAlign="center" width={1}>
                              <Label circular color="green">
                                {priority}
                              </Label>
                            </Table.Cell>
                            <Table.Cell className="progress-column" width={8}>
                              <Progress indicating percent={trackerPercent}  />
                            </Table.Cell>
                          </Table.Row>
                      
                    ))}
                </Table.Body>
              </Table>
            </Dimmer.Dimmable>
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
  sortDirection: state.trackerDashboard.sortDirection,
  selectedTrackerId: state.trackerDashboard.selectedTrackerId
});

const mapDispatchToProps = dispatch => {
  return {
    onHandleSort: (sortBy, sortDirection) => {
      dispatch(updateSort({sortBy, sortDirection}))
      dispatch(fetchTrackers())
    },
    onHandleEnableToggle: (filterId, isCurrentlyEnabled) => {
      dispatch(enableToggle(filterId, isCurrentlyEnabled))
    },
    onHandleTrackerSelection: (filterId) => {
      dispatch(updateTrackerSelection(filterId))
    }
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackerDashboard);
