/**
 * Copyright 2019 Google Inc.
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
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';

import { SERVER_OK } from 'constants/webCodes.js';
import {
  ABOUT_US,
  HOME,
  LOGIN,
  LOGIN_STATUS,
  LOGOUT,
  USER_PAGE
} from 'constants/links.js';
import { HIDDEN } from 'constants/css.js';
import { UserDataAction, storeUserData } from 'reducers/userData.js';

/** The common navbar ui used throughout the application. */
class CustomNavBar extends Component {
  componentDidMount() {
    this.fetchLoginStatus();
  }

  /** Fetches the login status of the current user. */
  fetchLoginStatus() {
    fetch(LOGIN_STATUS)
      .then(response =>
        response.status === SERVER_OK ? response.json() : null
      )
      .then(status => {
        const { storeUserData } = this.props;
        if (status) {
          storeUserData(UserDataAction.SET_USER_EMAIL, status.username);
        } else {
          console.log('Error: Server is unavailable.');
        }
      });
  }

  render() {
    const { userEmail } = this.props.userData;
    const hideIfSignedIn = userEmail ? HIDDEN : null;
    const hideIfSignedOut = !userEmail ? HIDDEN : null;

    return (
      <div className='CustomNavBar'>
        <nav>
          <ul>
            <li>
              <NavLink to={HOME}>Home</NavLink>
            </li>
            <li>
              <NavLink to={ABOUT_US}>About our Team</NavLink>
            </li>
            <li className={hideIfSignedOut}>
              <NavLink to={USER_PAGE + '?user=' + userEmail}>Your Page</NavLink>
            </li>
            <li className={hideIfSignedIn}>
              <a href={LOGIN}>Sign in</a>
            </li>
            <li className={hideIfSignedOut}>
              <a href={LOGOUT}>Logout</a>
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

CustomNavBar.propTypes = {
  /** The user's data stored in redux. */
  userData: PropTypes.object,
  /** A function to set the user data in redux store. */
  setUserData: PropTypes.func
};

/** Maps redux store state to class props. */
const mapStateToProps = function(state) {
  return { userData: state.userData };
};

/** Maps actions to userData.js */
const mapDispatchToProps = function(dispatch) {
  return {
    storeUserData: (action, param) => dispatch(storeUserData(action, param))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomNavBar);
