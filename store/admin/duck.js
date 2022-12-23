// import Rx from 'rxjs/Rx'
// import {Observable} from 'rxjs'
import { Record } from 'immutable'
import { assign } from 'lodash'
import Cookies from 'universal-cookie'
// import { INIT, LOADING, SUCCESS, ERROR } from '../../constants/phase'


import { fromPromise } from 'rxjs/observable/fromPromise'
import { of } from 'rxjs'
import { mergeMap, flatMap, catchError } from 'rxjs/operators'
import { ofType, combineEpics } from 'redux-observable'

import * as api from './api'

/***********************************
 * Action Types
 ***********/
const cookies = new Cookies()

export const CREATE_COMPANY = 'curbside/admin/CREATE_COMPANY'
export const GET_COMPANY = 'curbside/admin/GET_COMPANY'
export const GET_COMPANY_DETAIL = 'curbside/admin/GET_COMPANY_DETAIL'
export const UPDATE_COMPANY = 'curbside/admin/UPDATE_COMPANY'
export const GET_COMPANY_USERS = 'curbside/admin/GET_COMPANY_USERS'


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

  // phase: INIT,
  error: null,
  message: null,

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

export const createCompany = data => {
  return {
    type: CREATE_COMPANY,
    payload: api.createCompany(data)
  }
}

export const getCompanies = data => {
  return {
    type: GET_COMPANY,
    payload: api.getCompanies(data)
  }
}
export const getCompanyDetail = companyId => {
  return {
    type: GET_COMPANY_DETAIL,
    payload: api.getCompanyDetail(companyId)
  }
}

export const getCompanyUsers = id => {
  return {
    type: GET_COMPANY_USERS,
    payload: api.getCompanyUsers(id)
  }
}
export const updateCompany = data => {
  return {
    type: UPDATE_COMPANY,
    payload: api.updateCompany(data)
  }
}

/***********************************
 * Epics
 ***********************************/

// const loginUserEpic = action$ =>
//   action$.ofType(LOGIN_USER).mergeMap(action => {
//       return fromPromise(api.loginUser(action.payload))
//         .flatMap(payload => ([{
//           type: LOGIN_USER_SUCCESS,
//           payload
//         }]))
//         .catch(error => of({
//           type: LOGIN_USER_ERROR,
//           payload: { error }
//         }))
//     })


export const adminEpic = combineEpics(

)
