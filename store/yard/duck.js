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

export const GET_YARDS = 'curbside/yard/GET_YARDS'
export const ADD_YARD = 'curbside/yard/ADD_YARD'
export const DELETE_YARD = 'curbside/yard/DELETE_YARD'
export const UPDATE_YARD = 'curbside/yard/UPDATE_YARD'

export const ADD_DUMP = 'curbside/yard/ADD_DUMP'
export const GET_DUMPS = 'curbside/yard/GET_DUMPS'
export const UPDATE_DUMP = 'curbside/yard/UPDATE_DUMP'
export const DELETE_DUMP = 'curbside/yard/DELETE_DUMP'

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

export const getYards = data => {
  return {
    type: GET_YARDS,
    payload: api.getYards(data)
  }
}

export const addYard = data => {
  return {
    type: ADD_YARD,
    payload: api.addYard(data)
  }
}

export const updateYard = data => {
  return {
    type: UPDATE_YARD,
    payload: api.updateYard(data)
  }
}

export const deleteYard = data => {
  return {
    type: DELETE_YARD,
    payload: api.deleteYard(data)
  }
}

export const addDump = data => {
  return {
    type: ADD_DUMP,
    payload: api.addDump(data)
  }
}

export const getDumps = data => {
  return {
    type: GET_DUMPS,
    payload: api.getDumps(data)
  }
}

export const updateDump = data => {
  return {
    type: UPDATE_DUMP,
    payload: api.updateDump(data)
  }
}

export const deleteDump = data => {
  return {
    type: DELETE_DUMP,
    payload: api.deleteDump(data)
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



export const yardEpic = combineEpics(
  // loginUserEpic,
)
