// import Rx from 'rxjs/Rx'
// import Rx from 'rxjs/Rx'
// import {Observable} from 'rxjs'
import { Record } from 'immutable'
import { assign } from 'lodash'
import Cookies from 'universal-cookie'
import { INIT, LOADING, SUCCESS, ERROR } from '../../constants/phase'


import { fromPromise } from 'rxjs/observable/fromPromise'
import { of } from 'rxjs'
import { mergeMap, flatMap, catchError } from 'rxjs/operators'
import { ofType, combineEpics } from 'redux-observable'

import * as api from './api'

/***********************************
 * Action Types
 ***********/
const cookies = new Cookies()

export const GET_HAULERS = 'curbside/hauler/GET_HAULERS'
export const GET_HAULER_DETAILS = 'curbside/hauler/GET_HAULERS_DETAILS'
export const ADD_HAULER = 'curbside/hauler/ADD_HAULER'
export const DELETE_HAULER = 'curbside/hauler/DELETE_HAULER'
export const UPDATE_HAULER = 'curbside/hauler/UPDATE_HAULER'
export const DEFAULT_HAULER = 'curbside/hauler/DEFAULT_HAULER'

/***********************************
 * Initial State
 ***********/

// Unlike other ducks we are taking a class style approach
// for creating the InitialState. This is becuase we need to fetch the
// locally stored token in the constructor when it is created
const InitialStateInterface = {
  // We need this here to tell InitialState that there is a token key,
  // but it will be reset below to what is in localStorage, unless a value
  // is passed in when the object is instanciated
  data: {},
}

class InitialState extends Record(InitialStateInterface) {
  constructor(desiredValues) {
    // When we construct InitialState, we automatically update it's default value
    // for token to be what is stored in localStorage
    const token = '' // localStorage.getItem(Config.LocalStorageKeys.Authorization)
    super(assign({ token }, desiredValues))
  }
}

/***********************************
 * Reducer
 ***********/
// eslint-disable-next-line complexity, max-statements

export default function (state = new InitialState(), action = {}) {
  switch (action.type) {
    default: {
      return state
    }
  }
}


/***********************************
 * Action Creators
 ***********/

export const getHaulers = data => {
  return {
    type: GET_HAULERS,
    payload: api.getHaulers(data)
  }
}
export const getHaulerDetails = id => {
  return {
    type: GET_HAULER_DETAILS,
    payload: api.getHaulerDetails(id)
  }
}

export const addHauler = data => {
  return {
    type: ADD_HAULER,
    payload: api.addHauler(data)
  }
}

export const updateHauler = data => {
  return {
    type: UPDATE_HAULER,
    payload: api.updateHauler(data)
  }
}

export const deleteHauler = data => {
  return {
    type: DELETE_HAULER,
    payload: api.deleteHauler(data)
  }
}
export const setDefaultHauler = data => {
  return {
    type: DEFAULT_HAULER,
    payload: api.setDefaultHauler(data)
  }
}

/***********************************
 * Epics
 ***********************************/

// const signupUserEpic = action$ =>
//   action$
//     .ofType(SIGNUP_USER)
//     .mergeMap(action => {
//       return fromPromise(api.signupUser(action.payload))
//         .flatMap(payload => ([{
//           type: SIGNUP_USER_SUCCESS,
//           payload
//         }]))
//         .catch(error => of({
//           type: SIGNUP_USER_ERROR,
//           payload: { error }
//         }))
//     })



export const haulerEpic = combineEpics(
  // loginUserEpic,
)
