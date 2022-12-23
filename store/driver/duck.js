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

export const GET_DRIVERS = 'curbside/driver/GET_DRIVERS'
export const ADD_DRIVER = 'curbside/driver/ADD_DRIVER'
export const DELETE_DRIVER = 'curbside/driver/DELETE_DRIVER'
export const UPDATE_DRIVER = 'curbside/driver/UPDATE_DRIVER'

export const ADD_TRUCK = 'curbside/driver/ADD_TRUCK'
export const GET_TRUCKS = 'curbside/driver/GET_TRUCKS'
export const DELETE_TRUCK = 'curbside/driver/DELETE_TRUCK'
export const UPDATE_TRUCK = 'curbside/driver/UPDATE_TRUCK'

export const GET_DVIR = 'curbside/driver/GET_DVIR'


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

export const getDrivers = data => {
  return {
    type: GET_DRIVERS,
    payload: api.getDrivers(data)
  }
}

export const addDriver = data => {
  return {
    type: ADD_DRIVER,
    payload: api.addDriver(data)
  }
}

export const updateDriver = data => {
  return {
    type: UPDATE_DRIVER,
    payload: api.updateDriver(data)
  }
}

export const deleteDriver = data => {
  return {
    type: DELETE_DRIVER,
    payload: api.deleteDriver(data)
  }
}

export const addTruck = data => {
  return {
    type: ADD_TRUCK,
    payload: api.addTruck(data)
  }
}

export const getTrucks = data => {
  return {
    type: GET_TRUCKS,
    payload: api.getTrucks(data)
  }
}

export const updateTruck = data => {
  return {
    type: UPDATE_TRUCK,
    payload: api.updateTruck(data)
  }
}

export const deleteTruck = data => {
  return {
    type: DELETE_TRUCK,
    payload: api.deleteTruck(data)
  }
}

export const getTrucksDvir = data => {
  return {
    type: GET_DVIR,
    payload: api.getTrucksDvir(data)
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



export const driverEpic = combineEpics(
  // loginUserEpic,
)
