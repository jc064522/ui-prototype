// @flow

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
import {createAction, createActions, handleActions } from 'redux-actions';

import { push } from 'react-router-redux';

import { HttpError } from '../../ErrorTypes'







// This is just for the auth code -- TODO move it
declare type AuthenticationState = {
  idToken: string
};

// This is just for the Config code -- TODO Move it
declare type ConfigState = {
  streamTaskServiceUrl: string
};

// These are common to all thunks --TODO move it
type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
type GetState = () => StateRoot;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type PromiseAction = Promise<Action>;

// This is common to all reducers --TODO move it
declare type StateRoot = {
  trackerDashboard: TrackerState,
  authentication: AuthenticationState,
  config: ConfigState
};














export const UPDATE_TRACKERS: string = 'trackerDashboard/UPDATE_TRACKERS';



const fetch = window.fetch;

export const directions = {ascending: "ascending", descending: "descending"}
declare type Direction = $Keys<typeof directions>

export const sortByOptions = {pipeline: "Pipeline", priority: "Priority", progress: "progress"}
declare type SortByOption = $Keys<typeof sortByOptions>

declare type Tracker = {
  name: string,
  trackerMs: Date,
  trackerPercentage: number
};

type TrackerState = {
  +trackers: Array<Tracker>,
  +isLoading: boolean,
  +showCompleted: boolean,
  +sortBy: SortByOption, 
  +sortDirection: Direction,
  +pageSize: number,
  +pageOffset: number

};

const initialState: TrackerState = {
  trackers: [],
  isLoading: false,
  showCompleted: false,
  sortBy: "Pipeline",
  sortDirection: "ascending",
  pageSize: 10,
  pageOffset: 0
};

type UpdateTrackerAction = {
  type: typeof UPDATE_TRACKERS,
  trackers: Array<Tracker>
};

type Action = UpdateTrackerAction;





export const updateSort = createAction('trackerDashboard_UPDATE_SORT')
export const updateTrackers = createAction('trackerDashboard_UPDATE_TRACKERS')
export const updateEnabled = createAction('trackerDashboard_UPDATE_ENABLED',)

const reducers = handleActions(
  {
    trackerDashboard_UPDATE_SORT: (state, action) => (
     {
      ...state, 
      sortBy: action.payload.sortBy, 
      sortDirection: action.payload.sortDirection
    }),
    trackerDashboard_UPDATE_TRACKERS: (state, action) => ({...state, trackers: action.payload}),
    trackerDashboard_UPDATE_ENABLED: (state, action) => ({
      ...state,
       trackers: state.trackers.map(
           (tracker, i) => 
           tracker.filterId === action.payload.filterId ? 
            {...tracker, enabled: action.payload.enabled}
            : tracker)
    })
  },
  initialState
)

export default reducers



export const fetchTrackers = (): ThunkAction => (dispatch, getState) => {
  const state = getState()
  const jwsToken = state.authentication.idToken;

  let url = `${state.config.streamTaskServiceUrl}/?offset=${state.trackerDashboard.pageOffset}&sortBy=${state.trackerDashboard.sortBy}&sortDirection=${state.trackerDashboard.sortDirection}`;

  fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwsToken}`,
    },
    method: 'get',
    mode: 'cors',
  })
  .then(handleStatus)
  .then(response => response.json())
  .then(trackers => {
    dispatch(updateTrackers(trackers));
  })
  .catch(error => {
    //TODO: handle a bad response from the service, i.e. send the use to an error
    dispatch(push('/error'))
    console.log('Unable to fetch trackers!')
    console.log(error)
    this
  });
};

export const enableToggle = (filterId: String, isCurrentlyEnabled: boolean): ThunkAction => (dispatch, getState) => {
  const state = getState()
  const jwsToken = state.authentication.idToken
  let url =  `${state.config.streamTaskServiceUrl}/${filterId}`

  fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwsToken}`,
    },
    method: 'PATCH',
    mode: 'cors',
    body: JSON.stringify({op:"replace", path:"enabled", value:!isCurrentlyEnabled})
  })
  .then(handleStatus)
  .then(response => {
    dispatch(updateEnabled({filterId,enabled:!isCurrentlyEnabled}))
  })
  .catch(error => {
    dispatch(push('/error'))
    console.log('Unable to patch tracker!')
    console.log(error)
    this
  });
}


function handleStatus (response) {
  if (response.status === 200) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(new HttpError(response.status, response.statusText))
  }
}