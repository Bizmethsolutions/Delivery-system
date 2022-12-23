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

export const ADD_CONTAINER = 'curbside/container/ADD_CONTAINER'
export const GET_CONTAINER = 'curbside/container/GET_CONTAINER'
export const DELETE_CONTAINER = 'curbside/container/DELETE_CONTAINER'
export const UPDATE_CONTAINER = 'curbside/container/UPDATE_CONTAINER'



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

export const addContainer = data => {
  return {
    type: ADD_CONTAINER,
    payload: api.addContainer(data)
  }
}
export const getContainers = data => {
  return {
    type: GET_CONTAINER,
    payload: api.getContainers(data)
  }
}
export const deleteContainer = data => {
  return {
    type: DELETE_CONTAINER,
    payload: api.deleteContainer(data)
  }
}
export const updateContainer = data => {
  return {
    type: UPDATE_CONTAINER,
    payload: api.updateContainer(data)
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



export const containersEpic = combineEpics(
  // loginUserEpic,
)
