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

export const GET_ORDER_LIST = 'curbside/permit/GET_ORDER_LIST'
export const ADD_PERMIT = 'curbside/permit/ADD_PERMIT'
export const UPDATE_PERMIT = 'curbside/permit/UPDATE_PERMIT'
export const DELETE_PERMIT = 'curbside/permit/DELETE_PERMIT'
export const GET_PERMITS = 'curbside/permit/GET_PERMITS'
export const GET_PERMIT_BY_ORDERID = 'curbside/permit/GET_PERMIT_BY_ORDERID'

export const GET_PERMIT_COUNT = 'curbside/permit/GET_PERMIT_COUNT'
export const GET_PERMIT_COUNT_SUCCESS = 'curbside/permit/GET_PERMIT_COUNT_SUCCESS'
export const GET_PERMIT_COUNT_ERROR = 'curbside/permit/GET_PERMIT_COUNT_ERROR'

export const GET_PERMIT_FILTERS_COUNT = 'curbside/permit/GET_PERMIT_FILTERS_COUNT'



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
  permitCount: 0,
  permitPhase: INIT
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
    case GET_PERMIT_COUNT: {
      return state
        .set('permitPhase', LOADING)
        .set('error', null)
        .set('isSubmitting', true)
    }

    case GET_PERMIT_COUNT_SUCCESS: {
      const { payload } = action
        return state
          .set('permitPhase', SUCCESS)
          .set('permitCount', payload.count)
          // .set('message', payload.message)
    }

    case GET_PERMIT_COUNT_ERROR: {
      const { payload } = action
      return state
        .set('permitPhase', ERROR)
        // .set('error',  payload.message)
    }

    default: {
      return state
    }
  }
}


/***********************************
 * Action Creators
 ***********/

export const getOrderListForPermit = data => {
  return {
    type: GET_ORDER_LIST,
    payload: api.getOrderListForPermit(data)
  }
}
export const addPermit = data => {
  return {
    type: ADD_PERMIT,
    payload: api.addPermit(data)
  }
}
export const updatePermit = data => {
  return {
    type: UPDATE_PERMIT,
    payload: api.updatePermit(data)
  }
}
export const deletePermit = data => {
  return {
    type: DELETE_PERMIT,
    payload: api.deletePermit(data)
  }
}
export const getPermitsByOrder = data => {
  return {
    type: GET_PERMITS,
    payload: api.getPermitsByOrder(data)
  }
}
export const getPermitByOrderId = data => {
  return {
    type: GET_PERMIT_BY_ORDERID,
    payload: api.getPermitByOrderId(data)
  }
}
export const getPermitCount = data => {
  return {
    type: GET_PERMIT_COUNT,
    payload: data
  }
}

export const getPermitFiltersCount = data => {
  return {
    type: GET_PERMIT_FILTERS_COUNT,
    payload: api.getPermitFiltersCount(data)
  }
}



/***********************************
 * Epics
 ***********************************/

// const getPermitCountEpic = action$ =>
//   action$
//     .ofType(GET_PERMIT_COUNT)
//     .mergeMap(action => {
//       return fromPromise(api.getPermitCount(action.payload))
//         .flatMap(payload => ([{
//           type: GET_PERMIT_COUNT_SUCCESS,
//           payload
//         }]))
//         .catch(error => of({
//           type: GET_PERMIT_COUNT_ERROR,
//           payload: { error }
//         }))
//     })

  const getPermitCountEpic = action$ =>
    action$.pipe(
      ofType(GET_PERMIT_COUNT),
      mergeMap(action => {
        return fromPromise(api.getPermitCount(action.payload)).pipe(
          flatMap(payload => [
            {
              type: GET_PERMIT_COUNT_SUCCESS,
              payload
            }
          ]),
          catchError(error =>
            of({
              type: GET_PERMIT_COUNT_ERROR,
              payload: { error }
            })
          )
        )
      })
    )


export const permitEpic = combineEpics(
  // loginUserEpic,
  getPermitCountEpic
)
