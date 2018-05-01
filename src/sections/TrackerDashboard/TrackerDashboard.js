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

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import moment from 'moment'

import { Grid, Form, Label, Table, Progress, Dimmer, Loader } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

import {fetchTrackers} from './trackerDashboardData'

import './TrackerDashboard.css'

const dummyTrackers = [
  {
    name: 'FANTASTIC_PIPELINE_ALL_CAPS_FOR_SOME_REASON',
    trackerMs: moment()
      .subtract(4, 'hours')
      .toISOString(),
    progress: 76,
    lastPollAge: 6.1,
    completed: false,
    enabled: true,
    priority: 5
  },
  {
    name: 'FANTASTIC_PIPELINE_2',
    trackerMs: moment()
      .subtract(3, 'days')
      .toISOString(),
    progress: 1,
    lastPollAge: 1,
    completed: false,
    enabled: true,
    priority: 18
  },
  {
    name: 'FANTASTIC_PIPELINE_3',
    trackerMs: moment()
      .subtract(18, 'hours')
      .toISOString(),
    progress: 100,
    lastPollAge: 300,
    completed: true,
    enabled: false,
    priority: 10
  }
]

class TrackerDashboard extends Component {
  componentWillMount () {
    this.context.store.dispatch(fetchTrackers({sortBy: this.state.column, sortDirection: this.state.direction, showCompleted: this.state.showCompleted}))
  }

  // Set up some defaults
  state = {
    showCompleted: false,
    data: dummyTrackers,
    column: 'progress',
    direction: 'descending'
  };

  handleShowCompletedToggle = (e, toggleProps) => {
    this.setState({ showCompleted: toggleProps.checked })
  };

  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        // data: _sortBy(data, [clickedColumn]),
        data: data.sort((l, r) => l[clickedColumn] > r[clickedColumn]),
        direction: 'ascending'
      })

      return
    }

    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending'
    })
  };

  handleFilterByNameChange = (e, inputProps) => {
    console.log(inputProps.value)
    this.context.store.dispatch(fetchTrackers({sortBy: this.state.column, sortDirection: this.state.direction, showCompleted: this.state.showCompleted}))
    // TODO show Loader over the table
    // TODO submit query
  }

  render () {
    const { column, data, direction, showCompleted } = this.state

    const { dimTable } = this.props

    return (
      <div className='App'>
        <Grid>
          <Grid.Column width={4} />
          <Grid.Column width={8}>
            <Form>
              <Form.Group inline>
                <Form.Checkbox
                  inline
                  label='Include completed?'
                  toggle
                  onChange={this.handleShowCompletedToggle}
                />
                <Form.Input
                  icon='search'
                  iconPosition='left'
                  placeholder='Filter by name...'
                  onChange={this.handleFilterByNameChange}
                />
              </Form.Group>
            </Form>
          </Grid.Column>
          <Grid.Column width={4} />

          <Grid.Column width={16}>

            <Dimmer active={dimTable} inverted>
              <Loader size='medium' />
            </Dimmer>

            <Table sortable basic='very' className='tracker-table'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell
                    sorted={column === 'name' ? direction : null}
                    onClick={this.handleSort('name')}
                  >
                    Name
                  </Table.HeaderCell>
                  <Table.HeaderCell
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
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                {data
                  .filter(tracker => {
                    if (showCompleted) {
                      return true
                    } else {
                      return !tracker.completed
                    }
                  })
                  .map(({ name, priority, progress }) => (
                    <Table.Row key={name}>
                      <Table.Cell
                        className='name-column'
                        textAlign='right'
                        width={7}
                      >
                        {name}
                      </Table.Cell>
                      <Table.Cell
                        className='priority-column'
                        textAlign='center'
                        width={1}
                      >
                        <Label circular color='green'>
                          {priority}
                        </Label>
                      </Table.Cell>
                      <Table.Cell className='progress-column' width={8}>
                        <Progress percent={progress} indicating />
                      </Table.Cell>
                    </Table.Row>
                  ))}
              </Table.Body>
            </Table>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

TrackerDashboard.contextTypes = {
  store: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  dimTable: state.trackerDashboard.isLoading
})

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrackerDashboard)
