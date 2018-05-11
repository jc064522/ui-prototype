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

import { Grid, Form, Label, Table, Progress, Dimmer, Loader, Button, Popup, Header, Checkbox, List, Segment, Modal, Card, Input, Menu } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { fetchTrackers, updateSort, sortByOptions, directions, enableToggle, updateTrackerSelection, moveSelection } from './trackerDashboardData';

import TrackerDetails from './TrackerDetails'
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

    const { dimTable, trackers, onHandleSort, sortBy, sortDirection, onHandleEnableToggle, selectedTrackerId, onHandleTrackerSelection, onMoveSelection } = this.props;

    const selectedTracker = trackers.find(tracker => tracker.filterId === selectedTrackerId)
    const showDetails = selectedTracker !== undefined

    // Set up hotkeys to move the selection up and down
    Mousetrap.bind('up', () => onMoveSelection('up'));
    Mousetrap.bind('down', () => onMoveSelection('down'));
    Mousetrap.bind('esc', () => onHandleTrackerSelection(undefined));


    return (
        <div className="tracker-dashboard">
          <Menu attached='top'>
            <Menu.Menu position='left' className="search-container">
              <Input fluid icon='search' placeholder='Search...' />
            </Menu.Menu>
          </Menu>

          <div className={"table-container" + (showDetails ? " showing-details" : "")}>
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

                          <Table.Row key={filterId} className="tracker-row"  onClick={() => onHandleTrackerSelection(filterId)} active={selectedTrackerId === filterId}>
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
          </div>
          <TrackerDetails/>
        </div>
    );
  }
}

TrackerDashboard.contextTypes = {
  store: PropTypes.object.isRequired,
};

TrackerDashboard.propTypes = {
  onHandleSort: PropTypes.func.isRequired,
  onHandleEnableToggle: PropTypes.func.isRequired,
  onMoveSelection: PropTypes.func.isRequired
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
    },
    onMoveSelection: (direction) => {dispatch(moveSelection(direction))}
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackerDashboard);
