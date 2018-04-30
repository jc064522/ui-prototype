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
import { BrowserRouter, Route, withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Home from 'sections/Home'
import OriginalList from 'prototypes/OriginalList'
import Graph from 'prototypes/Graph'
import TrackerDashboard from 'sections/TrackerDashboard'
import { AuthenticationRequest, HandleAuthenticationResponse } from 'stroom-js'

class Routes extends Component {
  isLoggedIn () {
    return !!this.props.idToken
  }

  render () {
    return (
      <BrowserRouter>
        <div>
          {/* Application routes - no authentication required*/ }
          <Route exact path='/' component={Home} />
          {/* <Route path='/trackers' component={TrackerDashboard} /> */}
          <Route path='/prototypes/original_list' component={OriginalList} />
          <Route path='/prototypes/graph' component={Graph} />


          {/* Application Routes - require authentication */}
          <Route exact path={'/trackers'} render={() => (
            this.isLoggedIn() ? <TrackerDashboard /> : <AuthenticationRequest
              referrer='/'
              uiUrl={this.props.advertisedUrl}
              appClientId={this.props.appClientId}
              authenticationServiceUrl={this.props.authenticationServiceUrl} />
          )} />

          {/* Authentication routes */}
          <Route exact path={'/handleAuthentication'} render={() => (<HandleAuthenticationResponse
            authenticationServiceUrl={this.props.authenticationServiceUrl}
            authorisationServiceUrl={this.props.authorisationServiceUrl} />
          )} />
          <Route exact path={'/handleAuthenticationResponse'} render={() => (<HandleAuthenticationResponse
            authenticationServiceUrl={this.props.authenticationServiceUrl}
            authorisationServiceUrl={this.props.authorisationServiceUrl} />
          )} />


        </div>
      </BrowserRouter>
    )
  }
}


// App.contextTypes = {
//   store: PropTypes.object,
//   router: PropTypes.shape({
//     history: object.isRequired
//   })
// }

// App.propTypes = {
//   idToken: PropTypes.string.isRequired,
//   showUnauthorizedDialog: PropTypes.bool.isRequired
// }

const mapStateToProps = state => ({
  idToken: state.authentication.idToken,
  // showUnauthorizedDialog: state.login.showUnauthorizedDialog,
  advertisedUrl: state.config.advertisedUrl,
  appClientId: state.config.appClientId,
  authenticationServiceUrl: state.config.authenticationServiceUrl,
  authorisationServiceUrl: state.config.authorisationServiceUrl
})

const mapDispatchToProps = dispatch => bindActionCreators({
  // handleSessionTimeout
}, dispatch)

export default withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Routes))


// export default Routes
