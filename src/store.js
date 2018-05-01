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

import { createStore, applyMiddleware, compose } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import thunk from 'redux-thunk'
import createHistory from 'history/createBrowserHistory'
import logger from 'redux-logger'
import $ from 'jquery'

import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
// import { reducer as formReducer } from 'redux-form'
import { authenticationReducer as authentication, authorisationReducer as authorisation } from 'stroom-js'

import reducers from './reducers'
import config from './config'

// const reducers = combineReducers({
//   routing: routerReducer,
//   authentication,
//   authorisation,
//   // config
//   // form: formReducer
// })


export const history = createHistory()

const historyMiddleware = routerMiddleware(history)


var result = $.ajax({
  url: '/config.json',
  contentType: 'application/json',
  dataType: 'json',
  method: 'GET',
  async: false
})

const initialState = {
  config: result.responseJSON
}

const enhancers = []
const middleware = applyMiddleware(
  thunk,
  historyMiddleware,
  logger)

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension())
  }
}

const composedEnhancers = compose(
  middleware,
  ...enhancers
)

const store = createStore(
  reducers,
  initialState,
  middleware
)

export default store
