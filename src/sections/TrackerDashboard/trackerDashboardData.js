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
/*
 * Copyright 2017 Crown Copyright
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

export const UPDATE_TRACKERS = 'trackerDashboard/UPDATE_TRACKERS'

const fetch = window.fetch

const initialState = {
  trackers: [],
  isLoading: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_TRACKERS:
      return {
        ...state,
        trackers: action.trackers
      }

    default:
      return state
  }
}

export const fetchTrackers = (query) => {
  return (dispatch, getState) => {
    const jwsToken = getState().authentication.idToken
    fetch(`${getState().config.streamTaskServiceUrl}/?
      page=${query.page}
      &sortBy=${query.sortBy}
      &sortDirection=${query.sortDirection}
      &nameFilter=${query.nameFilter}`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + jwsToken
      },
      method: 'get',
      mode: 'cors'
    })
      .then(trackers => {
        dispatch({
          type: UPDATE_TRACKERS,
          trackers
        })
      })
  }
}
