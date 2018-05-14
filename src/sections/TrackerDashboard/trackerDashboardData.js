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
import { createAction, handleActions } from 'redux-actions';

import { push } from 'react-router-redux';

import { HttpError } from '../../ErrorTypes';

// This is just for the auth code -- TODO move it
declare type AuthenticationState = {
  idToken: string
};

// This is just for the Config code -- TODO Move it
declare type ConfigState = {
  streamTaskServiceUrl: string
};
export const UPDATE_TRACKERS: string = 'trackerDashboard/UPDATE_TRACKERS';

type UpdateTrackerAction = {
  type: typeof UPDATE_TRACKERS,
  trackers: Array<Tracker>
};

type Action = UpdateTrackerAction;

// These are common to all thunks --TODO move it
type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type GetState = () => StateRoot;
type PromiseAction = Promise<Action>;

// This is common to all reducers --TODO move it
declare type StateRoot = {
  trackerDashboard: TrackerState,
  authentication: AuthenticationState,
  config: ConfigState
};

const fetch = window.fetch;

export const directions = { ascending: 'ascending', descending: 'descending' };
declare type Direction = $Keys<typeof directions>;

export const sortByOptions = { Pipeline: 'Pipeline', Priority: 'Priority', Progress: 'progress' };
declare type SortByOption = $Keys<typeof sortByOptions>;

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
  +pageOffset: number,
  +searchCriteria: string
};

const initialState: TrackerState = {
  trackers: [],
  isLoading: false,
  showCompleted: false,
  sortBy: 'Pipeline',
  sortDirection: 'ascending',
  pageSize: 10,
  pageOffset: 0,
  searchCriteria: 'is:incomplete ',
};

export const updateSort = createAction('trackerDashboard_UPDATE_SORT');
export const updateTrackers = createAction('trackerDashboard_UPDATE_TRACKERS');
export const updateEnabled = createAction('trackerDashboard_UPDATE_ENABLED');
export const updateTrackerSelection = createAction('trackerDashboard_UPDATE_TRACKER_SELECTION');
export const moveSelectionUp = createAction('MOVE_SELECTION_UP');
export const moveSelectionDown = createAction('MOVE_SELECTION_DOWN');
export const moveSelection = createAction('MOVE_SELECTION');
export const updateSearchCriteria = createAction('UPDATE_SEARCH_CRITERIA');

const reducers = handleActions(
  {
    trackerDashboard_UPDATE_SORT: (state, action) => ({
      ...state,
      sortBy: action.payload.sortBy,
      sortDirection: action.payload.sortDirection,
    }),
    trackerDashboard_UPDATE_TRACKERS: (state, action) => ({ ...state, trackers: action.payload }),
    trackerDashboard_UPDATE_ENABLED: (state, action) => ({
      ...state,
      // TODO: use a filter then a map
      trackers: state.trackers.map((tracker, i) =>
        (tracker.filterId === action.payload.filterId
          ? { ...tracker, enabled: action.payload.enabled }
          : tracker)),
    }),
    trackerDashboard_UPDATE_TRACKER_SELECTION: (state, action) => ({
      ...state,
      selectedTrackerId: action.payload,
    }),
    MOVE_SELECTION: (state, action) => {
      const currentIndex = state.trackers.findIndex(tracker => tracker.filterId === state.selectedTrackerId);

      let nextSelectedId;
      if (currentIndex === -1) {
        // There's no selection so we'll leave the selection as undefined
      } else if (action.payload.toLowerCase() === 'up') {
        if (currentIndex === 0) {
          nextSelectedId = state.trackers[currentIndex].filterId;
        } else {
          nextSelectedId = state.trackers[currentIndex - 1].filterId;
        }
      } else if (currentIndex === state.trackers.length - 1) {
        nextSelectedId = state.trackers[currentIndex].filterId;
      } else {
        nextSelectedId = state.trackers[currentIndex + 1].filterId;
      }
      return {
        ...state,
        selectedTrackerId: nextSelectedId,
      };
    },
    UPDATE_SEARCH_CRITERIA: (state, action) => ({
      ...state,
      searchCriteria: action.payload,
    }),
  },
  initialState,
);

export default reducers;

export const fetchTrackers = (): ThunkAction => (dispatch, getState) => {
  const state = getState();
  const jwsToken = state.authentication.idToken;

  let url = `${state.config.streamTaskServiceUrl}/?`;
  url += `offset=${state.trackerDashboard.pageOffset}`;
  url += `&sortBy=${state.trackerDashboard.sortBy}`;
  url += `&sortDirection=${state.trackerDashboard.sortDirection}`;

  if (
    state.trackerDashboard.searchCriteria !== '' &&
    state.trackerDashboard.searchCriteria !== undefined
  ) {
    url += `&filter=${state.trackerDashboard.searchCriteria}`;
  }

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
    .then((trackers) => {
      dispatch(updateTrackers(trackers));
    })
    .catch((error) => {
      // TODO: handle a bad response from the service, i.e. send the use to an error
      dispatch(push('/error'));
      console.log('Unable to fetch trackers!');
      console.log(error);
      this;
    });
};

export const enableToggle = (filterId: string, isCurrentlyEnabled: boolean): ThunkAction => (
  dispatch,
  getState,
) => {
  const state = getState();
  const jwsToken = state.authentication.idToken;
  const url = `${state.config.streamTaskServiceUrl}/${filterId}`;

  fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwsToken}`,
    },
    method: 'PATCH',
    mode: 'cors',
    body: JSON.stringify({ op: 'replace', path: 'enabled', value: !isCurrentlyEnabled }),
  })
    .then(handleStatus)
    .then((response) => {
      dispatch(updateEnabled({ filterId, enabled: !isCurrentlyEnabled }));
    })
    .catch((error) => {
      dispatch(push('/error'));
      console.log('Unable to patch tracker!');
      console.log(error);
      this;
    });
};

function handleStatus(response) {
  if (response.status === 200) {
    return Promise.resolve(response);
  }
  return Promise.reject(new HttpError(response.status, response.statusText));
}
