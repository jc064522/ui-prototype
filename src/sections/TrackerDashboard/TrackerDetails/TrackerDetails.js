import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

import moment from 'moment';

import {
  Grid,
  Form,
  Label,
  Table,
  Progress,
  Dimmer,
  Loader,
  Button,
  Popup,
  Header,
  Checkbox,
  List,
  Segment,
  Modal,
  Card,
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { enableToggle, updateTrackerSelection } from '../trackerDashboardData';

class TrackerDetails extends Component {
  render() {
    const { selectedTracker, onHandleEnableToggle, onHandleTrackerSelection } = this.props;
    if (selectedTracker !== undefined) {
      return (
        <div className="details-container">
          <Card.Group centered className="details-content">
            <Card fluid>
              <Card.Content>
                {/* <Image floated='right' size='mini' src='/assets/images/avatar/large/steve.jpg' /> */}
                <Card.Header>
                  <Table className="tracker-details-table">
                    <Table.Body>
                      <Table.Row className="tracker-row">
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

                <Card.Meta>This tracker:</Card.Meta>
                <Card.Description>
                  <Grid centered divided columns={3}>
                    <Grid.Column textAlign="left">
                      <List bulleted>
                        <List.Item>
                          has a <strong>last poll age</strong> of {selectedTracker.lastPollAge}
                        </List.Item>
                        <List.Item>
                          has a <strong>task count</strong> of {selectedTracker.taskCount}
                        </List.Item>
                        <List.Item>
                          was <strong>last active</strong>{' '}
                          {moment(selectedTracker.trackerMs)
                            .calendar()
                            .toLowerCase()}
                        </List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column>
                      <List bulleted>
                        <List.Item>
                          {selectedTracker.status ? 'has a' : 'does not have a'}{' '}
                          <strong>status</strong>
                          {selectedTracker.status ? ` of ${selectedTracker.status}` : undefined}
                        </List.Item>
                        <List.Item>
                          {selectedTracker.streamCount ? 'has a' : 'does not have a'}{' '}
                          <strong>stream count</strong>
                          {selectedTracker.streamCount
                            ? ` of ${selectedTracker.streamCount}`
                            : undefined}
                        </List.Item>
                        <List.Item>
                          {selectedTracker.eventCount ? 'has an' : 'does not have an'}{' '}
                          <strong>event count</strong>
                          {selectedTracker.eventCount
                            ? ` of ${selectedTracker.eventCount}`
                            : undefined}
                        </List.Item>
                      </List>
                    </Grid.Column>
                    <Grid.Column textAlign="left">
                      <List bulleted>
                        <List.Item>
                          was <strong>created</strong> by '{selectedTracker.createUser}'{' '}
                          {moment(selectedTracker.createdOn)
                            .calendar()
                            .toLowerCase()}
                        </List.Item>
                        <List.Item>
                          was <strong>updated</strong> by '{selectedTracker.updateUser}'{' '}
                          {moment(selectedTracker.updatedOn)
                            .calendar()
                            .toLowerCase()}
                        </List.Item>
                      </List>
                    </Grid.Column>
                  </Grid>
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Grid>
                  <Grid.Column width={8}>
                    <Checkbox
                      toggle
                      label="Enabled?"
                      checked={selectedTracker.enabled}
                      onMouseDown={() =>
                        onHandleEnableToggle(selectedTracker.filterId, selectedTracker.enabled)
                      }
                    />
                  </Grid.Column>
                  <Grid.Column width={8}>
                    <Button basic color="green" onClick={() => onHandleTrackerSelection(undefined)}>
                      OK
                    </Button>
                  </Grid.Column>
                </Grid>
              </Card.Content>
            </Card>
          </Card.Group>
        </div>
      );
    }
    return <div />;
  }
}

// TrackerDetails.contextTypes = {
//     store: PropTypes.object.isRequired,
//   };

TrackerDetails.propTypes = {
  // onHandleSort: PropTypes.func.isRequired,
  // onHandleEnableToggle: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  selectedTracker: state.trackerDashboard.trackers.find(tracker => tracker.filterId === state.trackerDashboard.selectedTrackerId),
});

const mapDispatchToProps = dispatch => ({
  onHandleEnableToggle: (filterId, isCurrentlyEnabled) => {
    dispatch(enableToggle(filterId, isCurrentlyEnabled));
  },
  onHandleTrackerSelection: (filterId) => {
    dispatch(updateTrackerSelection(filterId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TrackerDetails);
