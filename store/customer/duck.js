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

export const GET_CUSTOMER = 'curbside/customer/GET_CUSTOMER'
export const GET_CUSTOMER_BY_ID = 'curbside/customer/GET_CUSTOMER_BY_ID'
export const ADD_CUSTOMER = 'curbside/customer/ADD_CUSTOMER'
export const DELETE_CUSTOMER = 'curbside/customer/DELETE_CUSTOMER'
export const UPDATE_CUSTOMER = 'curbside/customer/UPDATE_CUSTOMER'
export const ADD_CARD = 'curbside/customer/ADD_CARD'
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

export const fetchCustomers = data => {
  return {
    type: GET_CUSTOMER,
    payload: api.fetchCustomers(data)
  }
}

export const addCostomer = data => {
  return {
    type: ADD_CUSTOMER,
    payload: api.addCostomer(data)
  }
}

export const updateCostomer = data => {
  return {
    type: UPDATE_CUSTOMER,
    payload: api.updateCostomer(data)
  }
}

export const deleteCustomer = id => {
  return {
    type: DELETE_CUSTOMER,
    payload: api.deleteCustomer(id)
  }
}

export const addCard = (data) => {
  return {
    type: ADD_CARD,
    payload: api.addCard(data)
  }
}

export const getCustomerById = (data) => {
  return {
    type: GET_CUSTOMER_BY_ID,
    payload: api.getCustomerById(data)
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



export const customerEpic = combineEpics(
  // loginUserEpic,
)
