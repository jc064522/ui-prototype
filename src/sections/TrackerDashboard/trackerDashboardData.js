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

export const UPDATE_TRACKERS: string = 'trackerDashboard/UPDATE_TRACKERS'

const fetch = window.fetch

declare type Tracker = {
  name: string,
  trackerMs: Date,
  trackerPercentage: number 
}

declare type AuthenticationState = {
  idToken: string
}

declare type ConfigState = {
  streamTaskServiceUrl: string
};
 
declare type StateRoot = {
  tracherDash: TrackerState,
  authentication: AuthenticationState,
  config: ConfigState
};

type TrackerState = {
  +trackers: Array<Tracker>,
  +isLoading: boolean
};

type Dispatch = (action: Action | ThunkAction | PromiseAction) => any;
type GetState = () => StateRoot;
type ThunkAction = (dispatch: Dispatch, getState: GetState) => any;
type PromiseAction = Promise<Action>;

const initialState: TrackerState = {
  trackers: [],
  isLoading: false
};

type UpdateTrackerAction = {
  type: typeof UPDATE_TRACKERS,
  trackers: Array<Tracker>
};

type Action = UpdateTrackerAction;

export default (
  state: TrackerState = initialState,
  action: Action
): TrackerState => {
  switch (action.type) {
    case UPDATE_TRACKERS:
      return {
        ...state,
        trackers: action.trackers
      };

    default:
      return state;
  }
};

function updateTrackers(value: Array<Tracker>): UpdateTrackerAction {
  return { type: UPDATE_TRACKERS, trackers: value };
}

export const fetchTrackers = (query: {
  page: number,
  sortBy: string,
  sortDirection: string,
  nameFilter?: string
}): ThunkAction => {
  return (dispatch, getState) => {
    const jwsToken = getState().authentication.idToken;
    let url = `${getState().config.streamTaskServiceUrl}/?
    page=${query.page}
    &sortBy=${query.sortBy}
    &sortDirection=${query.sortDirection}`;
    if (query.nameFilter) {
      url = url + `&nameFilter=${query.nameFilter ? "" : query.nameFilter}`;
    }

    fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + jwsToken
      },
      method: "get",
      mode: "cors"
    }).then(trackers => {
      dispatch(updateTrackers(trackers));
    });
  };
};
