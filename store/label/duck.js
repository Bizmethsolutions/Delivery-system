import 'rxjs'
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { mergeMap, flatMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Record } from 'immutable'
import { ofType } from 'redux-observable';
import { combineEpics } from 'redux-observable'
//import HttpStatus from 'http-status-codes'
import { assign } from 'lodash'

import { INIT, LOADING, SUCCESS, ERROR } from '../../constants/phase'
import Config from '../../config'
import Cookies from 'universal-cookie'

import * as api from './api'

/***********************************
 * Action Types
 ***********/
const cookies = new Cookies();

export const CREATE_LABEL = 'curbside/user/task/CREATE_LABEL'
// export const CREATE_LABEL_SUCCESS = 'curbside/user/task/CREATE_LABEL_SUCCESS'
// export const CREATE_LABEL_ERROR = 'curbside/user/task/CREATE_LABEL_ERROR'

export const GET_LABEL = 'curbside/user/task/GET_LABEL'
// export const GET_LABEL_SUCCESS = 'curbside/user/task/GET_LABEL_SUCCESS'
// export const GET_LABEL_ERROR = 'curbside/user/task/GET_LABEL_ERROR'

// export const GET_SEARCH_LABEL = 'curbside/user/task/GET_SEARCH_LABEL'
// export const GET_SEARCH_LABEL_SUCCESS = 'curbside/user/task/GET_SEARCH_LABEL_SUCCESS'
// export const GET_SEARCH_LABEL_ERROR = 'curbside/user/task/GET_SEARCH_LABEL_ERROR'

export const UPDATE_LABEL = 'curbside/user/task/UPDATE_LABEL'
// export const UPDATE_LABEL_SUCCESS = 'curbside/user/task/UPDATE_LABEL_SUCCESS'
// export const UPDATE_LABEL_ERROR = 'curbside/user/task/UPDATE_LABEL_ERROR'

export const DELETE_LABEL = 'curbside/user/task/DELETE_LABEL'
// export const DELETE_LABEL_SUCCESS = 'curbside/user/task/DELETE_LABEL_SUCCESS'
// export const DELETE_LABEL_ERROR = 'curbside/user/task/DELETE_LABEL_ERROR'

export const ASSIGN_LABEL = 'curbside/user/task/ASSIGN_LABEL'
// export const ASSIGN_LABEL_SUCCESS = 'curbside/user/task/ASSIGN_LABEL_SUCCESS'
// export const ASSIGN_LABEL_ERROR = 'curbside/user/task/ASSIGN_LABEL_ERROR'

export const CLEAR_PHASE = 'curbside/user/CLEAR_PHASE'
/***********************************
 * Initial State
 ***********/

// Unlike other ducks we are taking a class style approach
// for creating the InitialState. This is becuase we need to fetch the
// locally stored token in the constructor when it is created
const InitialStateInterface = {
  token: null,  // We need this here to tell InitialState that there is a token key,
                // but it will be reset below to what is in localStorage, unless a value
                // is passed in when the object is instanciated
  createLabelPhase: INIT,
  getLabelPhase: INIT,
  // getSearchLabelPhase: INIT,
  updateLabelPhase: INIT,
  deleteLabelPhase: INIT,
  assignLabelPhase: INIT,
  labelError: {},
  labels: [],
  createLabelData: {},
  newlabel: false,
  error: []
}
class InitialState extends Record(InitialStateInterface) {
  constructor(desiredValues) {
    // When we construct InitialState, we automatically update it's default value
    // for token to be what is stored in localStorage
    const token = localStorage.getItem(Config.LocalStorageKeys.Authorization)
    super(assign({ token }, desiredValues))
  }
}

/***********************************
 * Reducer
 ***********/

// eslint-disable-next-line complexity, max-statements

export default function (state = new InitialState(), action = {}) {

  switch (action.type) {

    // case GET_LABEL: {
    //   return state
    //     .set('getLabelPhase', LOADING)
    //     .set('error', null)
    // }
    // case GET_LABEL_SUCCESS: {
    //   const { payload } = action
    //   return state
    //     .set('getLabelPhase', SUCCESS)
    //     .set('createLabelPhase', INIT)
    //     .set('updateLabelPhase', INIT)
    //     .set('deleteLabelPhase', INIT)
    //     .set('assignLabelPhase', INIT)
    //     .set('labels', payload.data)
    //     .set('error', null)
    // }
    // case GET_LABEL_ERROR: {
    //   return state
    //     .set('getLabelPhase', ERROR)
    //     .set('error', null)
    // }

    // case GET_SEARCH_LABEL: {
    //   return state
    //     .set('getSearchLabelPhase', LOADING)
    //     .set('error', null)
    // }
    // case GET_SEARCH_LABEL_SUCCESS: {
    //   const { payload } = action
    //   return state
    //     .set('getSearchLabelPhase', SUCCESS)
    //     .set('createLabelPhase', INIT)
    //     .set('updateLabelPhase', INIT)
    //     .set('deleteLabelPhase', INIT)
    //     .set('labels', payload.data)
    //     .set('error', null)
    // }
    // case GET_SEARCH_LABEL_ERROR: {
    //   return state
    //     .set('getSearchLabelPhase', ERROR)
    //     .set('error', null)
    // }

    // case UPDATE_LABEL: {
    //   return state
    //     .set('updateLabelPhase', LOADING)
    //     .set('error', null)
    // }
    //
    // case UPDATE_LABEL_SUCCESS: {
    //   const { payload } = action
    //   return state
    //     .set('updateLabelPhase', SUCCESS)
    //     .set('error', null)
    // }
    //
    // case UPDATE_LABEL_ERROR: {
    //   const { payload } = action
    //   return state
    //     .set('updateLabelPhase', ERROR)
    //     .set('labelError', payload.error.error.message)
    //     .set('error', null)
    // }

    // case DELETE_LABEL: {
    //   return state
    //     .set('deleteLabelPhase', LOADING)
    //     .set('error', null)
    // }
    //
    // case DELETE_LABEL_SUCCESS: {
    //   const { payload } = action
    //   return state
    //     .set('deleteLabelPhase', SUCCESS)
    //     .set('error', null)
    // }
    //
    // case DELETE_LABEL_ERROR: {
    //   const { payload } = action
    //   return state
    //     .set('deleteLabelPhase', ERROR)
    //     .set('labelError', payload.error.error.message)
    //     .set('error', null)
    // }

    // case CREATE_LABEL: {
    //   return state
    //     .set('createLabelPhase', LOADING)
    //     .set('error', null)
    // }
    //
    // case CREATE_LABEL_SUCCESS: {
    //   const { payload } = action
    //   return state
    //     .set('createLabelPhase', SUCCESS)
    //     .set('createLabelData', payload.data )
    //     .set('newlabel', true)
    //     .set('error', null)
    // }
    //
    // case CREATE_LABEL_ERROR: {
    //   const { payload } = action
    //   return state
    //     .set('createLabelPhase', ERROR)
    //     .set('error', null)
    // }

    // case ASSIGN_LABEL: {
    //   return state
    //     .set('assignLabelPhase', LOADING)
    //     .set('newlabel', false)
    //     .set('error', null)
    // }
    //
    // case ASSIGN_LABEL_SUCCESS: {
    //   const { payload } = action
    //   return state
    //     .set('assignLabelPhase', SUCCESS)
    //     .set('newlabel', false)
    //     .set('error', null)
    // }
    //
    // case ASSIGN_LABEL_ERROR: {
    //   const { payload } = action
    //   return state
    //     .set('assignLabelPhase', ERROR)
    //     .set('labelError', payload.error.error.message)
    //     .set('newlabel', false)
    //     .set('error', null)
    // }

    case CLEAR_PHASE : {
      return state
      .set('getLabelPhase', INIT)
      // .set('getSearchLabelPhase', INIT)
      .set('updateLabelPhase', INIT)
      .set('deleteLabelPhase', INIT)
      .set('createLabelPhase',INIT)
    }

    default: {
      return state
    }
  }
}


/***********************************
 * Action Creators
 ***********/

export const getLabel = (credentials) => {
  return {
    type: GET_LABEL,
    payload: api.getLabel(credentials)
  }
}

export const updateLabel = (credentials) => {
  return {
    type: UPDATE_LABEL,
    payload: api.updateLabel(credentials)
  }
}

export const deleteLabel = (credentials) => {
  return {
    type: DELETE_LABEL,
    payload: api.deleteLabel(credentials)
  }
}

export const createLabel = (credentials) => {
  return {
    type: CREATE_LABEL,
    payload: api.createLabel(credentials)
  }
}

export const assignLabel = (credentials) => {
  return {
    type: ASSIGN_LABEL,
    payload: api.assignLabel(credentials)
  }
}

export const clearPhaseLabel = () => {
  return {
    type: CLEAR_PHASE
  }
}
/***********************************
 * Epics
 ***********************************/


// const getLabelEpic = action$ =>
//   action$.pipe(
//     ofType(GET_LABEL),
//     mergeMap(action => {
//       return fromPromise(api.getLabel(action.payload)).pipe(
//         flatMap(payload => [
//           {
//             type: GET_LABEL_SUCCESS,
//             payload
//           }
//         ]),
//         catchError(error =>
//           of({
//             type: GET_LABEL_ERROR,
//             payload: { error }
//           })
//         )
//     )})
//   );

  // const updateLabelEpic = action$ =>
  // action$.pipe(
  //   ofType(UPDATE_LABEL),
  //   mergeMap(action => {
  //     return fromPromise(api.updateLabel(action.payload)).pipe(
  //       flatMap(payload => [
  //         {
  //           type: UPDATE_LABEL_SUCCESS,
  //           payload
  //         }
  //       ]),
  //       catchError(error =>
  //         of({
  //           type: UPDATE_LABEL_ERROR,
  //           payload: { error }
  //         })
  //       )
  //   )})
  // );

  // const deleteLabelEpic = action$ =>
  // action$.pipe(
  //   ofType(DELETE_LABEL),
  //   mergeMap(action => {
  //     return fromPromise(api.deleteLabel(action.payload)).pipe(
  //       flatMap(payload => [
  //         {
  //           type: DELETE_LABEL_SUCCESS,
  //           payload
  //         }
  //       ]),
  //       catchError(error =>
  //         of({
  //           type: DELETE_LABEL_ERROR,
  //           payload: { error }
  //         })
  //       )
  //   )})
  // );

// const createLabelEpic = action$ =>
//   action$.pipe(
//     ofType(CREATE_LABEL),
//     mergeMap(action => {
//       return fromPromise(api.createLabel(action.payload)).pipe(
//         flatMap(payload => [
//           {
//             type: CREATE_LABEL_SUCCESS,
//             payload
//           }
//         ]),
//         catchError(error =>
//           of({
//             type:CREATE_LABEL_ERROR,
//             payload: { error }
//           })
//         )
//     )})
//   );

// const assignLabelEpic = action$ =>
//   action$.pipe(
//     ofType(ASSIGN_LABEL),
//     mergeMap(action => {
//       return fromPromise(api.assignLabel(action.payload)).pipe(
//         flatMap(payload => [
//           {
//             type: ASSIGN_LABEL_SUCCESS,
//             payload
//           }
//         ]),
//         catchError(error =>
//           of({
//             type: ASSIGN_LABEL_ERROR,
//             payload: { error }
//           })
//         )
//     )})
//   );

export const labelEpic = combineEpics(
  // getLabelEpic,
  // updateLabelEpic,
  // deleteLabelEpic,
  // createLabelEpic,
  // assignLabelEpic
)
