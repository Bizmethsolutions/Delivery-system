import Rx from 'rxjs/Rx'
import {Observable} from 'rxjs'
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

export const LOGIN_USER = 'curbside/user/LOGIN_USER'
export const UPDATE_USER = 'curbside/user/UPDATE_USER'
export const SEND_LOGIN_CODE = 'curbside/user/SEND_LOGIN_CODE'
export const GET_COMPANY_INFO = 'curbside/user/GET_COMPANY_INFO'
export const GET_USER_TOKEN = 'curbside/user/GET_USER_TOKEN'
export const GET_USER_DETAIL = 'curbside/user/GET_USER_DETAIL'
export const CHECK_ZIP = 'curbside/user/CHECK_ZIP'
export const TRACKING_LINK = 'curbside/user/TRACKING_LINK'
export const GET_ZIP_PRICING = 'curbside/user/GET_ZIP_PRICING'

export const SIGNUP_USER = 'curbside/user/SIGNUP_USER'
export const SIGNUP_USER_SUCCESS = 'curbside/user/SIGNUP_USER_SUCCESS'
export const SIGNUP_USER_ERROR = 'curbside/user/SIGNUP_USER_ERROR'

export const GET_USER = 'curbside/user/GET_USER'
export const GET_USER_SUCCESS = 'curbside/user/GET_USER_SUCCESS'
export const GET_USER_ERROR = 'curbside/user/GET_USER_ERROR'
export const GET_COMPANY_ORDERS = 'curbside/user/GET_COMPANY_ORDERS'

export const LOGOUT_USER = 'curbside/user/LOGOUT_USER'
export const ADD_ENTERPRISE_USER = 'curbside/user/ADD_ENTERPRISE_USER'
export const DELETE_ENTERPRISE_USER = 'curbside/user/DELETE_ENTERPRISE_USER'
export const UPDATE_ENTERPRISE_USER = 'curbside/user/UPDATE_ENTERPRISE_USER'
export const LOGOUT_USER_SUCCESS = 'curbside/user/LOGOUT_USER_SUCCESS'
export const UPDATE_STATUS = 'curbside/user/UPDATE_STATUS'

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
  token: null,
  phase: INIT,
  userPhase: INIT,
  user: {},
  error: null,
  message: null,
  isSubmitting: false,
  signupUser: {},
  signupPhase: INIT,
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
    case SIGNUP_USER: {
      return state
        .set('signupPhase', LOADING)
        .set('error', null)
        .set('isSubmitting', true)
    }

    case SIGNUP_USER_SUCCESS: {
      const { payload } = action
      if(payload.success){
        // cookies.set('Authorization', payload.token);
        localStorage.setItem('Authorization', payload.data.token)
        return state
          .set('signupPhase', SUCCESS)
          .set('user', payload.data)
          .set('message', payload.message)
      } else {
        return state
          .set('signupPhase', ERROR)
          .set('user', payload.data)
          .set('error',  payload.message)
      }
    }

    case SIGNUP_USER_ERROR: {
      const { payload } = action
      return state
        .set('signupPhase', ERROR)
        .set('error',  payload.message)
    }

    case GET_USER: {
      return state
        .set('userPhase', LOADING)
        .set('error', null)
        .set('isSubmitting', true)
    }

    case GET_USER_SUCCESS: {
      const { payload } = action
      if(payload.type === 'success'){
        localStorage.setItem('companyId', payload.data.companyId ?  payload.data.companyId : '')
        return state
          .set('userPhase', SUCCESS)
          .set('user', payload.data)
          // .set('error', payload.message)
          .set('isSubmitting', true)
      }
      break;
    }

    case GET_USER_ERROR: {
      const { payload } = action
      return state
        .set('userPhase', ERROR)
        .set('user', {})
        .set('error', payload.message)
        .set('isSubmitting', true)
    }

    case LOGOUT_USER: {
      // cookies.remove('Authorization')
      localStorage.removeItem('Authorization') //remove only user
      localStorage.clear() // for remove Authorization token
      return state
        .set('phase', SUCCESS)
        .set('error', null)
        .set('isSubmitting', true)
    }

    default: {
      return state
    }
  }
}


/***********************************
 * Action Creators
 ***********/

export const sendLoginCode = credentials => {
  return {
    type: SEND_LOGIN_CODE,
    payload: api.sendLoginCode(credentials)
  }
}
export const loginUser = credentials => {
  return {
    type: LOGIN_USER,
    payload: api.loginUser(credentials)
  }
}

export const getCompanyInfo = credentials => {
  return {
    type: GET_COMPANY_INFO,
    payload: api.getCompanyInfo(credentials)
  }
}

export const checkZip = credentials => {
  return {
    type: CHECK_ZIP,
    payload: api.checkZip(credentials)
  }
}

export const getZipPricing = credentials => {
  return {
    type: GET_ZIP_PRICING,
    payload: api.getZipPricing(credentials)
  }
}

export const getUserDetail = credentials => {
  return {
    type: GET_USER_DETAIL,
    payload: api.getUserDetail(credentials)
  }
}

export const getCompanyOrders = credentials => {
  return {
    type: GET_COMPANY_ORDERS,
    payload: api.getCompanyOrders(credentials)
  }
}

export const updateUser = credentials => {
  return {
    type: UPDATE_USER,
    payload: api.updateUser(credentials)
  }
}

export const updateStatus = credentials => {
  return {
    type: UPDATE_STATUS,
    payload: api.updateStatus(credentials)
  }
}

export const signupUser = credentials => {
  return {
    type: SIGNUP_USER,
    payload: credentials
  }
}

export const getUser = data => {
  return {
    type: GET_USER,
    payload: data
  }
}

export const trackingLink = data => {
  return {
    type: TRACKING_LINK,
    payload: api.trackingLink(data)
  }
}

export const addEnterpriseUser = data => {
  return {
    type: ADD_ENTERPRISE_USER,
    payload: api.addEnterpriseUser(data)
  }
}
export const deleteEnterpriseUser = id => {
  return {
    type: DELETE_ENTERPRISE_USER,
    payload: api.deleteEnterpriseUser(id)
  }
}
export const updateEnterpriseUser = data => {
  return {
    type: UPDATE_ENTERPRISE_USER,
    payload: api.updateEnterpriseUser(data)
  }
}

export const getToken = data => {
  return {
    type: GET_USER_TOKEN,
    payload: api.getToken(data)
  }
}

export const handleSignOut = () => ({
  type: LOGOUT_USER
})

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

  const signupUserEpic = action$ =>
    action$.pipe(
      ofType(SIGNUP_USER),
      mergeMap(action => {
        return fromPromise(api.signupUser(action.payload)).pipe(
          flatMap(payload => [
            {
              type: SIGNUP_USER_SUCCESS,
              payload
            }
          ]),
          catchError(error =>
            of({
              type: SIGNUP_USER_ERROR,
              payload: { error }
            })
          )
        )
      })
    )

const getUserEpic = action$ =>
  action$.pipe(
    ofType(GET_USER),
    mergeMap(action => {
      return fromPromise(api.getUser(action.payload)).pipe(
        flatMap(payload => [
          {
            type: GET_USER_SUCCESS,
            payload
          }
        ]),
        catchError(error =>
          of({
            type: GET_USER_ERROR,
            payload: { error }
          })
        )
      )
    })
  )

export const userEpic = combineEpics(
  // loginUserEpic,
  signupUserEpic,
  getUserEpic
)
