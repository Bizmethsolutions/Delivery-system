import 'rxjs'
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
import _ from 'lodash'

import { INIT, LOADING, SUCCESS, ERROR } from '../../constants/phase'
import Config from '../../config'
import Cookies from 'universal-cookie'

import * as api from './api'

/***********************************
 * Action Types
 ***********/
const cookies = new Cookies();

// export const GET_ORDER = 'curbside/user/GET_ORDER'
// export const GET_ORDER_SUCCESS = 'curbside/user/GET_ORDER_SUCCESS'
// export const GET_ORDER_ERROR = 'curbside/user/GET_ORDER_ERROR'

export const GET_JOB = 'curbside/user/GET_JOB'
export const GET_JOB_SUCCESS = 'curbside/user/GET_JOB_SUCCESS'
export const GET_JOB_ERROR = 'curbside/user/GET_JOB_ERROR'

export const GET_NOTIFICATIONS = 'curbside/user/GET_NOTIFICATIONS'
export const GET_NOTIFICATIONS_SUCCESS = 'curbside/user/GET_NOTIFICATIONS_SUCCESS'
export const GET_NOTIFICATIONS_ERROR = 'curbside/user/GET_NOTIFICATIONS_ERROR'

export const GET_ENTERPRISE_NOTIFICATION = 'curbside/user/GET_ENTERPRISE_NOTIFICATION'
export const GET_ENTERPRISE_NOTIFICATION_SUCCESS = 'curbside/user/GET_ENTERPRISE_NOTIFICATION_SUCCESS'
export const GET_ENTERPRISE_NOTIFICATION_ERROR = 'curbside/user/GET_ENTERPRISE_NOTIFICATION_ERROR'

export const VIEW_NOTIFICATIONS = 'curbside/user/GET_NOTIFICATIONS'
export const GET_DRIVER = 'curbside/user/GET_DRIVER'
// export const GET_DRIVER_SUCCESS = 'curbside/user/GET_DRIVER_SUCCESS'
// export const GET_DRIVER_ERROR = 'curbside/user/GET_DRIVER_ERROR'

export const ASSIGN_DRIVER = 'curbside/user/ASSIGN_DRIVER'
export const ASSIGN_DRIVER_SUCCESS = 'curbside/user/ASSIGN_DRIVER_SUCCESS'
export const ASSIGN_DRIVER_ERROR = 'curbside/user/ASSIGN_DRIVER_ERROR'

export const ADD_DRIVER = 'curbside/user/ADD_DRIVER'
// export const ADD_DRIVER_SUCCESS = 'curbside/user/ADD_DRIVER_SUCCESS'
// export const ADD_DRIVER_ERROR = 'curbside/user/ADD_DRIVER_ERROR'

export const GET_ORDER_BY_ORDERID = 'curbside/user/GET_ORDER_BY_ORDERID'
// export const ADD_TASK = 'curbside/user/ADD_TASK'
// export const ADD_TASK_SUCCESS = 'curbside/user/ADD_TASK_SUCCESS'
// export const ADD_TASK_ERROR = 'curbside/user/ADD_TASK_ERROR'

export const SEND_NEW_ORDER_NOTIFICATION = 'curbside/user/SEND_NEW_ORDER_NOTIFICATION'

export const INCOMPLETE_JOB = 'curbside/user/INCOMPLETE_JOB'
export const INCOMPLETE_JOB_SUCCESS = 'curbside/user/INCOMPLETE_JOB_SUCCESS'
export const INCOMPLETE_JOB_ERROR = 'curbside/user/INCOMPLETE_JOB_ERROR'

export const UPDATE_TASK = 'curbside/user/UPDATE_TASK'
// export const UPDATE_TASK_SUCCESS = 'curbside/user/UPDATE_TASK_SUCCESS'
// export const UPDATE_TASK_ERROR = 'curbside/user/UPDATE_TASK_ERROR'

export const DELETE_TASK = 'curbside/user/DELETE_TASK'
// export const DELETE_TASK_SUCCESS = 'curbside/user/DELETE_TASK_SUCCESS'
// export const DELETE_TASK_ERROR = 'curbside/user/DELETE_TASK_ERROR'

export const UPDATE_DRIVER = 'curbside/user/UPDATE_DRIVER'
// export const UPDATE_DRIVER_SUCCESS = 'curbside/user/UPDATE_DRIVER_SUCCESS'
// export const UPDATE_DRIVER_ERROR = 'curbside/user/UPDATE_DRIVER_ERROR'

export const DELETE_DRIVER = 'curbside/user/DELETE_DRIVER'
// export const DELETE_DRIVER_SUCCESS = 'curbside/user/DELETE_DRIVER_SUCCESS'
// export const DELETE_DRIVER_ERROR = 'curbside/user/DELETE_DRIVER_ERROR'

export const ENTERPRISE_MESSAGE = 'curbside/user/ENTERPRISE_MESSAGE'

export const ORDER_DETAIL = 'curbside/user/ORDER_DETAIL'
export const ORDER_DETAIL_SUCCESS = 'curbside/user/ORDER_DETAIL_SUCCESS'
export const ORDER_DETAIL_ERROR = 'curbside/user/ORDER_DETAIL_ERROR'

export const SEND_MESSAGE = 'curbside/user/SEND_MESSAGE'
// export const SEND_MESSAGE_SUCCESS = 'curbside/user/SEND_MESSAGE_SUCCESS'
// export const SEND_MESSAGE_ERROR = 'curbside/user/SEND_MESSAGE_ERROR'

export const GET_MESSAGE = 'curbside/user/GET_MESSAGE'
// export const GET_MESSAGE_SUCCESS = 'curbside/user/GET_MESSAGE_SUCCESS'
// export const GET_MESSAGE_ERROR = 'curbside/user/GET_MESSAGE_ERROR'

export const GET_LOCATION = 'curbside/user/GET_LOCATION'
// export const GET_LOCATION_SUCCESS = 'curbside/user/GET_LOCATION_SUCCESS'
// export const GET_LOCATION_ERROR = 'curbside/user/GET_LOCATION_ERROR'

export const GET_YARDS_AND_DUMPS = 'curbside/user/GET_YARDS_AND_DUMPS'
export const GET_YARDS_AND_DUMPS_SUCCESS = 'curbside/user/GET_YARDS_AND_DUMPS_SUCCESS'
export const GET_YARDS_AND_DUMPS_ERROR = 'curbside/user/GET_YARDS_AND_DUMPS_ERROR'

export const DOWNLOAD_INVOICE = 'curbside/user/DOWNLOAD_INVOICE'
export const DOWNLOAD_INVOICE_SUCCESS = 'curbside/user/DOWNLOAD_INVOICE_SUCCESS'
export const DOWNLOAD_INVOICE_ERROR = 'curbside/user/DOWNLOAD_INVOICE_ERROR'

export const UPDATE_JOB_INDEX = 'curbside/user/UPDATE_JOB_INDEX'
export const UPDATE_JOB_INDEX_SUCCESS = 'curbside/user/UPDATE_JOB_INDEX_SUCCESS'
export const UPDATE_JOB_INDEX_ERROR = 'curbside/user/UPDATE_JOB_INDEX_ERROR'

export const SAVE_ACCESSIBILITY = 'curbside/user/SAVE_ACCESSIBILITY'
export const SAVE_ACCESSIBILITY_SUCCESS = 'curbside/user/SAVE_ACCESSIBILITY_SUCCESS'
export const SAVE_ACCESSIBILITY_ERROR = 'curbside/user/SAVE_ACCESSIBILITY_ERROR'

export const ADD_ORDER = 'curbside/user/ADD_ORDER'
export const UPDATE_ORDER = 'curbside/user/UPDATE_ORDER'
export const EXCHANGE_ORDER = 'curbside/user/EXCHANGE_ORDER'
export const REMOVAL_ORDER = 'curbside/user/REMOVAL_ORDER'
export const GET_ALL_ORDERS = 'curbside/user/GET_ALL_ORDERS'
export const DELETE_ORDERS = 'curbside/user/DELETE_ORDERS'
export const GET_CONTAINER = 'curbside/user/GET_CONTAINER'
export const GET_ALL_ORDERS_REPORT = 'curbside/user/GET_ALL_ORDERS_REPORT'
export const EXPORT_REPORT = 'curbside/user/EXPORT_REPORT'
export const EXPORT_ALL = 'curbside/user/EXPORT_ALL'
export const ADD_TASK = 'curbside/user/ADD_TASK'
export const GET_ORDER = 'curbside/user/GET_ORDER'
export const GET_ORDER_BY_CUSTOMER = 'curbside/user/GET_ORDER_BY_CUSTOMER'
export const PENDING_ORDERS = 'curbside/user/PENDING_ORDERS'
export const SEARCH_BY_CUSTMER_OR_ORDER = 'curbside/user/SEARCH_BY_CUSTMER_OR_ORDER'
export const SEARCH_BY_ORDER = 'curbside/user/SEARCH_BY_ORDER'
export const RECAP_LOGS_MATRIX = 'curbside/user/RECAP_LOGS_MATRIX'
export const FETCH_ALL_LIVE_ORDERS = 'curbside/user/FETCH_ALL_LIVE_ORDERS'
export const ORDER_DETAIL_BY_ID = 'curbside/user/ORDER_DETAIL_BY_ID'
export const COMPLETE_ORDER = 'curbside/user/COMPLETE_ORDER'
export const REVERT_ORDER = 'curbside/user/REVERT_ORDER'
export const GET_ORDER_ACTIVITY = 'curbside/user/GET_ORDER_ACTIVITY'
export const UPLOAD_FILE = 'curbside/user/UPLOAD_FILE'
export const CHARGE_FOR_EXCHANGE = 'curbside/user/CHARGE_FOR_EXCHANGE'
export const APPLY_COUPON = 'curbside/user/APPLY_COUPON'
export const RECAP_LOGS_RESULTS = 'curbside/user/RECAP_LOGS_RESULTS'
export const DOWNLOAD_RECEIPT = 'curbside/user/DOWNLOAD_RECEIPT'
export const DOWNLOAD_BULK_RECEIPT = 'curbside/user/DOWNLOAD_BULK_RECEIPT'
export const GET_ORDERS_BY_COMPANY = 'curbside/user/GET_ORDERS_BY_COMPANY'
export const GET_ETAS_ORDERS = 'curbside/user/GET_ETAS_ORDERS'
export const GET_ALL_ORDERS_OF_CUSTOMER = 'curbside/user/GET_ALL_ORDERS_OF_CUSTOMER'
export const GET_ALL_JOB_FOR_ORDER_LOG = 'curbside/user/GET_ALL_JOB_FOR_ORDER_LOG'

export const GET_DASH_REPORTS = 'curbside/user/GET_DASH_REPORTS'
export const GET_EXPORT_DASH_REPORTS = 'curbside/user/GET_EXPORT_DASH_REPORTS'
export const GET_ORDERS_FOR_PERMIT = 'curbside/user/GET_ORDERS_FOR_PERMIT'
export const GET_CONTAINER_LOC = 'curbside/user/GET_CONTAINER_LOC'

export const GET_ORDER_BY_ID = 'curbside/user/GET_ORDER_BY_ID'
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
  loginPhase: INIT,
  orderPhase: INIT,
  jobPhase: INIT,
  driverPhase: INIT,
  assignPhase: INIT,
  createLabelPhase: INIT,
  getLabelPhase: INIT,
  // getSearchLabelPhase: INIT,
  updateLabelPhase: INIT,
  deleteLabelPhase: INIT,
  locationPhase: INIT,
  addDriverPhase: INIT,
  getNotificationPhase: INIT,
  updateJobIndexPhase: INIT,
  updateDriverPhase: INIT,
  deleteDriverPhase: INIT,
  updateTaskPhase: INIT,
  deleteTaskPhase: INIT,
  addTaskPhase: INIT,
  incompleteJobPhase: INIT,
  orderDetailPhase: INIT,
  sendMessagePhase: INIT,
  getMessagePhase: INIT,
  downloadInvoicePhase: INIT,
  getYardsAndDumpPhase: INIT,
  getEnterpriseNotificationPhase: INIT,
  uploadFilePhase: INIT,
  accessibilityPhase: INIT,
  downloadInvoiceData: {},
  driverError: {},
  orderDetail: {},
  uploadFile: {},
  error: {},
  messages: [],
  orders: [],
  jobs: [],
  yardsanddumpdata: [],
  enterpriseNotifications: [],
  notifications: [],
  drivers: [],
  trucks: []
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

    // case GET_ORDER: {
    //   return state
    //     .set('orderPhase', LOADING)
    //     .set('updateJobIndexPhase', INIT)
    //     .set('error', null)
    // }
    //
    // case GET_ORDER_SUCCESS: {
    //   const { payload } = action
    //   return state
    //     .set('orderPhase', SUCCESS)
    //     .set('downloadInvoicePhase', INIT)
    //     .set('orderDetailPhase', INIT)
    //     .set('orders', payload.data)
    //     .set('assignPhase', INIT)
    //     .set('error', null)
    // }
    //
    // case GET_ORDER_ERROR: {
    //   return state
    //     .set('orderPhase', ERROR)
    //     .set('error', null)
    // }

    case GET_JOB: {
      return state
        .set('jobPhase', LOADING)
        // .set('updateJobIndexPhase', INIT)
        .set('error', null)
    }

    case GET_JOB_SUCCESS: {
      const { payload } = action
      // console.log("datd",payload.data)
      return state
        .set('jobPhase', SUCCESS)
        // .set('downloadInvoicePhase', INIT)
        .set('jobs', payload.data)
        .set('assignPhase', INIT)
        .set('error', null)
    }

    case GET_JOB_ERROR: {
      return state
        .set('jobPhase', ERROR)
        .set('error', null)
    }
    case GET_YARDS_AND_DUMPS: {
      return state
        .set('getYardsAndDumpPhase', LOADING)
        .set('error', null)
    }

    case GET_YARDS_AND_DUMPS_SUCCESS: {
      const { payload } = action
      return state
        .set('getYardsAndDumpPhase', SUCCESS)
        .set('yardsanddumpdata', payload.data)
    }

    case GET_YARDS_AND_DUMPS_ERROR: {
      return state
        .set('getYardsAndDumpPhase', ERROR)
        .set('error', null)
    }

    // case GET_DRIVER: {
    //   return state
    //     .set('driverPhase', LOADING)
    //     .set('error', null)
    // }
    //
    // case GET_DRIVER_SUCCESS: {
    //   const { payload } = action
    //   return state
    //     .set('driverPhase', SUCCESS)
    //     .set('addDriverPhase', INIT)
    //     .set('updateDriverPhase', INIT)
    //     .set('deleteDriverPhase', INIT)
    //     .set('updateJobIndexPhase', INIT)
    //     .set('drivers', payload.data)
    //     .set('error', null)
    // }
    //
    // case GET_DRIVER_ERROR: {
    //   return state
    //     .set('driverPhase', ERROR)
    //     .set('error', null)
    // }

    case ASSIGN_DRIVER: {
      return state
        .set('assignPhase', LOADING)
        .set('error', null)
    }

    case ASSIGN_DRIVER_SUCCESS: {
      const { payload } = action
      return state
        .set('assignPhase', SUCCESS)
        .set('error', null)
    }

    case ASSIGN_DRIVER_ERROR: {
      return state
        .set('assignPhase', ERROR)
        .set('error', null)
    }

    // case ADD_DRIVER: {
    //   return state
    //     .set('addDriverPhase', LOADING)
    //     .set('error', null)
    // }
    //
    // case ADD_DRIVER_SUCCESS: {
    //   const { payload } = action
    //   let driversList = localStorage.getItem('lanesArr') ? JSON.parse(localStorage.lanesArr) : []
    //   driversList.push({name: payload.data.name, id: payload.data.id, loginTime: ""})
    //   localStorage.setItem('lanesArr', JSON.stringify(driversList))
    //   return state
    //     .set('addDriverPhase', SUCCESS)
    //     .set('error', null)
    // }
    //
    // case ADD_DRIVER_ERROR: {
    //   const { payload } = action
    //   return state
    //     .set('addDriverPhase', ERROR)
    //     .set('driverError', payload.error.error.message)
    //     .set('error', null)
    // }

    // case UPDATE_DRIVER: {
    //   return state
    //     .set('updateDriverPhase', LOADING)
    //     .set('error', null)
    // }
    //
    // case UPDATE_DRIVER_SUCCESS: {
    //   const { payload } = action
    //   let driversList = localStorage.getItem('lanesArr') ? JSON.parse(localStorage.lanesArr) : []
    //   let editIndex = _.findIndex(driversList, function(driver) {
    //     return String(driver.id) === String(payload.data.id)
    //   })
    //   if (editIndex > -1) {
    //     driversList[editIndex].name = payload.data.name
    //   }
    //   localStorage.setItem('lanesArr', JSON.stringify(driversList))
    //   return state
    //     .set('updateDriverPhase', SUCCESS)
    //     .set('error', null)
    // }
    //
    // case UPDATE_DRIVER_ERROR: {
    //   const { payload } = action
    //   return state
    //     .set('updateDriverPhase', ERROR)
    //     .set('driverError', payload.error.error.message)
    //     .set('error', null)
    // }

    // case DELETE_DRIVER: {
    //   return state
    //     .set('deleteDriverPhase', LOADING)
    //     .set('error', null)
    // }
    //
    // case DELETE_DRIVER_SUCCESS: {
    //   const { payload } = action
    //   let driversList = localStorage.getItem('lanesArr') ? JSON.parse(localStorage.lanesArr) : []
    //   let removeIndex = _.findIndex(driversList, function(driver) {
    //     return String(driver.id) === String(payload.data.id)
    //   })
    //   if (removeIndex > -1) {
    //     driversList.splice(removeIndex, 1);
    //   }
    //   localStorage.setItem('lanesArr', JSON.stringify(driversList))
    //   return state
    //     .set('deleteDriverPhase', SUCCESS)
    //     .set('error', null)
    // }
    //
    // case DELETE_DRIVER_ERROR: {
    //   const { payload } = action
    //   return state
    //     .set('deleteDriverPhase', ERROR)
    //     .set('driverError', payload.error.error.message)
    //     .set('error', null)
    // }

    // case GET_LOCATION: {
    //   return state
    //     .set('locationPhase', LOADING)
    //     .set('error', null)
    // }
    //
    // case GET_LOCATION_SUCCESS: {
    //   const { payload } = action
    //   return state
    //     .set('locationPhase', SUCCESS)
    //     .set('trucks', payload.data.vehicles)
    //     .set('error', null)
    // }
    //
    // case GET_LOCATION_ERROR: {
    //   return state
    //     .set('locationPhase', ERROR)
    //     .set('error', null)
    // }

    // case ADD_TASK: {
    //   return state
    //     .set('addTaskPhase', LOADING)
    //     .set('error', null)
    // }
    //
    // case ADD_TASK_SUCCESS: {
    //   const { payload } = action
    //   return state
    //     .set('addTaskPhase', SUCCESS)
    //     .set('error', null)
    // }
    //
    // case ADD_TASK_ERROR: {
    //   const { payload } = action
    //   return state
    //     .set('addTaskPhase', ERROR)
    //     .set('error', null)
    // }

    // case UPDATE_TASK: {
    //   return state
    //     .set('updateTaskPhase', LOADING)
    //     .set('error', null)
    // }
    //
    // case UPDATE_TASK_SUCCESS: {
    //   const { payload } = action
    //   return state
    //     .set('updateTaskPhase', SUCCESS)
    //     .set('error', null)
    // }
    //
    // case UPDATE_TASK_ERROR: {
    //   const { payload } = action
    //   return state
    //     .set('updateTaskPhase', ERROR)
    //     .set('error', null)
    // }

    // case DELETE_TASK: {
    //   return state
    //     .set('deleteTaskPhase', LOADING)
    //     .set('error', null)
    // }
    //
    // case DELETE_TASK_SUCCESS: {
    //   const { payload } = action
    //   return state
    //     .set('deleteTaskPhase', SUCCESS)
    //     .set('error', null)
    // }
    //
    // case DELETE_TASK_ERROR: {
    //   const { payload } = action
    //   return state
    //     .set('deleteTaskPhase', ERROR)
    //     .set('error', null)
    // }

    case INCOMPLETE_JOB: {
      return state
        .set('incompleteJobPhase', LOADING)
        .set('error', null)
    }

    case INCOMPLETE_JOB_SUCCESS: {
      const { payload } = action
      return state
        .set('incompleteJobPhase', SUCCESS)
        .set('error', null)
    }

    case INCOMPLETE_JOB_ERROR: {
      const { payload } = action
      return state
        .set('incompleteJobPhase', ERROR)
        .set('error', null)
    }

    case ORDER_DETAIL: {
      return state
        .set('orderDetailPhase', LOADING)
        .set('error', null)
    }

    case ORDER_DETAIL_SUCCESS: {
      const { payload } = action
      return state
        .set('orderDetailPhase', SUCCESS)
        .set('orderDetail', payload.data)
        .set('error', null)
    }

    case ORDER_DETAIL_ERROR: {
      const { payload } = action
      return state
        .set('orderDetailPhase', ERROR)
        .set('error', null)
    }

    // case SEND_MESSAGE: {
    //   return state
    //     .set('sendMessagePhase', LOADING)
    //     .set('error', null)
    // }
    //
    // case SEND_MESSAGE_SUCCESS: {
    //   const { payload } = action
    //   return state
    //     .set('sendMessagePhase', SUCCESS)
    //     .set('error', null)
    // }
    //
    // case SEND_MESSAGE_ERROR: {
    //   const { payload } = action
    //   return state
    //     .set('sendMessagePhase', ERROR)
    //     .set('error', null)
    // }

    // case GET_MESSAGE: {
    //   return state
    //     .set('getMessagePhase', LOADING)
    //     .set('error', null)
    // }
    //
    // case GET_MESSAGE_SUCCESS: {
    //   const { payload } = action
    //   return state
    //     .set('getMessagePhase', SUCCESS)
    //     .set('sendMessagePhase', INIT)
    //     .set('messages', payload.data)
    //     .set('error', null)
    // }
    //
    // case GET_MESSAGE_ERROR: {
    //   const { payload } = action
    //   return state
    //     .set('getMessagePhase', ERROR)
    //     .set('error', null)
    // }

    case GET_NOTIFICATIONS: {
      return state
        .set('getNotificationPhase', LOADING)
        .set('error', null)
    }

    case GET_NOTIFICATIONS_SUCCESS: {
      const { payload } = action
      return state
        .set('getNotificationPhase', SUCCESS)
        .set('notifications', payload.data)
        .set('error', null)
    }

    case GET_NOTIFICATIONS_ERROR: {
      const { payload } = action
      return state
        .set('getNotificationPhase', ERROR)
        .set('error', null)
    }

    case GET_ENTERPRISE_NOTIFICATION: {
      return state
        .set('getEnterpriseNotificationPhase', LOADING)
        .set('error', null)
    }

    case GET_ENTERPRISE_NOTIFICATION_SUCCESS: {
      const { payload } = action
      return state
        .set('getEnterpriseNotificationPhase', SUCCESS)
        .set('enterpriseNotifications', payload.data)
        .set('error', null)
    }

    case GET_ENTERPRISE_NOTIFICATION_ERROR: {
      const { payload } = action
      return state
        .set('getEnterpriseNotificationPhase', ERROR)
        .set('error', null)
    }

    case DOWNLOAD_INVOICE: {
      return state
        .set('downloadInvoicePhase', LOADING)
        .set('error', null)
    }

    case DOWNLOAD_INVOICE_SUCCESS: {
      const { payload } = action
      return state
        .set('downloadInvoicePhase', SUCCESS)
        .set('downloadInvoiceData', payload.data)
        .set('error', null)
    }

    case DOWNLOAD_INVOICE_ERROR: {
      const { payload } = action
      return state
        .set('downloadInvoicePhase', ERROR)
        .set('error', null)
    }

    // case UPDATE_JOB_INDEX: {
    //   return state
    //     .set('updateJobIndexPhase', LOADING)
    //     .set('driverPhase', INIT)
    //     .set('assignPhase', INIT)
    //     .set('addTaskPhase', INIT)
    //     .set('updateTaskPhase', INIT)
    //     .set('deleteTaskPhase', INIT)
    //     .set('incompleteJobPhase', INIT)
    //     .set('incompleteJobPhase', INIT)
    //     .set('deleteDriverPhase', INIT)
    //     .set('deleteDriverPhase', INIT)
    //     .set('createLabelPhase',INIT)
    //     .set('error', null)
    // }
    //
    // case UPDATE_JOB_INDEX_SUCCESS: {
    //   const { payload } = action
    //   return state
    //     .set('updateJobIndexPhase', SUCCESS)
    //     .set('error', null)
    // }
    //
    // case UPDATE_JOB_INDEX_ERROR: {
    //   const { payload } = action
    //   return state
    //     .set('updateJobIndexPhase', ERROR)
    //     .set('error', null)
    // }

    case CLEAR_PHASE : {
      return state
      .set('downloadInvoicePhase', INIT)
      .set('driverPhase', INIT)
      .set('getLabelPhase', INIT)
      // .set('getSearchLabelPhase', INIT)
      .set('assignPhase', INIT)
      .set('addTaskPhase', INIT)
      .set('updateTaskPhase', INIT)
      .set('updateLabelPhase', INIT)
      .set('deleteTaskPhase', INIT)
      .set('deleteLabelPhase', INIT)
      .set('incompleteJobPhase', INIT)
      .set('incompleteJobPhase', INIT)
      .set('deleteDriverPhase', INIT)
      .set('deleteDriverPhase', INIT)
      .set('orderPhase', INIT)
      .set('jobPhase', INIT)
      .set('orderDetailPhase', INIT)
      .set('getYardsAndDumpPhase', INIT)
      .set('accessibilityPhase', INIT)
      .set('createLabelPhase',INIT)
    }

    case SAVE_ACCESSIBILITY: {
     return state
       .set('accessibilityPhase', LOADING)
       .set('error', null)
    }

    case SAVE_ACCESSIBILITY_SUCCESS: {
     const { payload } = action
      return state
       .set('accessibilityPhase', SUCCESS)
       .set('error', null)
    }

    case SAVE_ACCESSIBILITY_ERROR: {
     const { payload } = action
      return state
       .set('accessibilityPhase', ERROR)
       .set('error', null)
    }

    default: {
      return state
    }
  }
}


/***********************************
 * Action Creators
 ***********/


export const getJobsByDate = (credentials) => {
  return {
    type: GET_JOB,
    payload: api.getJobsByDate(credentials)
  }
}

export const getYardsAndDump = (credentials) => {
  return {
    type: GET_YARDS_AND_DUMPS,
    payload: api.getYardsAndDump(credentials)
  }
}

export const assignDriver = (credentials) => {
  return {
    type: ASSIGN_DRIVER,
    payload: api.assignDriver(credentials)
  }
}

export const addDriver = (credentials) => {
  return {
    type: ADD_DRIVER,
    payload: api.addDriver(credentials)
  }
}

export const updateDriver = (credentials) => {
  return {
    type: UPDATE_DRIVER,
    payload: api.updateDriver(credentials)
  }
}

export const completeOrder = (credentials) => {
  return {
    type: COMPLETE_ORDER,
    payload: api.completeOrder(credentials)
  }
}

export const deleteDriver = (credentials) => {
  return {
    type: DELETE_DRIVER,
    payload: api.deleteDriver(credentials)
  }
}

export const incompleteJob = (credentials) => {
  return {
    type: INCOMPLETE_JOB,
    payload: credentials
  }
}

export const applyCoupon = (credentials) => {
  return {
    type: APPLY_COUPON,
    payload: api.applyCoupon(credentials)
  }
}

export const getOrderDetail = (credentials) => {
  return {
    type: ORDER_DETAIL,
    payload: api.getOrderDetail(credentials)
  }
}

export const getAllOrdersOfCustomer = (credentials) => {
  return {
    type: GET_ALL_ORDERS_OF_CUSTOMER,
    payload: api.getAllOrdersOfCustomer(credentials)
  }
}
export const getOrderDetailById = (credentials) => {
  return {
    type: ORDER_DETAIL_BY_ID,
    payload: api.getOrderDetailById(credentials)
  }
}

export const viewedNotification = (credentials) => {
  return {
    type: VIEW_NOTIFICATIONS,
    payload: api.viewedNotification(credentials)
  }
}

export const sendMessage = (data) => {
  return {
    type: SEND_MESSAGE,
    payload: api.sendMessage(data)
  }
}

export const enterpriseMessage = (data) => {
  return {
    type: ENTERPRISE_MESSAGE,
    payload: api.enterpriseMessage(data)
  }
}

export const getMessage = (data) => {
  return {
    type: GET_MESSAGE,
    payload: api.getMessage(data)
  }
}

export const getNotifications = (data) => {
  return {
    type: GET_NOTIFICATIONS,
    payload: data
  }
}

export const uploadFile = (data) => {
  return {
    type: UPLOAD_FILE,
    payload: api.uploadFile(data)
  }
}

export const getEnterpriseNotifications = (data) => {
  return {
    type: GET_ENTERPRISE_NOTIFICATION,
    payload: data
  }
}

export const downloadReceipt = (data) => {
  return {
    type: DOWNLOAD_INVOICE,
    payload: api.downloadReceipt(data)
  }
}

export const updateJobIndex = (data) => {
  return {
    type: UPDATE_JOB_INDEX,
    payload: api.updateJobIndex(data)
  }
}

export const saveAccessibility = (data) => {
 return {
   type: SAVE_ACCESSIBILITY,
   payload: data
  }
}

export const addOrder = (data) => {
  return {
    type: ADD_ORDER,
    payload: api.addOrder(data)
  }
}

export const updateOrder = (data) => {
  return {
    type: UPDATE_ORDER,
    payload: api.updateOrder(data)
  }
}

export const exchangeOrder = (data) => {
  return {
    type: EXCHANGE_ORDER,
    payload: api.exchangeOrder(data)
  }
}

export const removalOrder = (data) => {
  return {
    type: REMOVAL_ORDER,
    payload: api.removalOrder(data)
  }
}

export const deleteOrder = (id) => {
  return {
    type: DELETE_ORDERS,
    payload: api.deleteOrder(id)
  }
}
export const getAllOrders = (data) => {
  return {
    type: GET_ALL_ORDERS,
    payload: api.getAllOrders(data)
  }
}
export const getContainer = () => {
  return {
    type: GET_CONTAINER,
    payload: api.getContainer()
  }
}
export const getContainerLoc = () => {
  return {
    type: GET_CONTAINER_LOC,
    payload: api.getContainerLoc()
  }
}
export const fetchOrdersReport = (data) => {
  return {
    type: GET_ALL_ORDERS_REPORT,
    payload: api.fetchOrdersReport(data)
  }
}

export const getOrderByOrderId = (data) => {
  return {
    type: GET_ORDER_BY_ORDERID,
    payload: api.getOrderByOrderId(data)
  }
}

export const exportreport = (data) => {
  return {
    type: EXPORT_REPORT,
    payload: api.exportreport(data)
  }
}
export const exportall = (data) => {
  return {
    type: EXPORT_ALL,
    payload: api.exportall(data)
  }
}

export const getOrder = (data) => {
  return {
    type: GET_ORDER,
    payload: api.getOrder(data)
  }
}

export const addTask = (data) => {
  return {
    type: ADD_TASK,
    payload: api.addTask(data)
  }
}

export const sendNewOrderNotification = (data) => {
  return {
    type: SEND_NEW_ORDER_NOTIFICATION,
    payload: api.sendNewOrderNotification(data)
  }
}

export const getLocation = (credentials) => {
  return {
    type: GET_LOCATION,
    payload: api.getLocation(credentials)
  }
}

export const deleteTask = (credentials) => {
  return {
    type: DELETE_TASK,
    payload: api.deleteTask(credentials)
  }
}

export const updateTask = (credentials) => {
  return {
    type: UPDATE_TASK,
    payload: api.updateTask(credentials)
  }
}

export const getDriver = (credentials) => {
  return {
    type: GET_DRIVER,
    payload: api.getDriver(credentials)
  }
}
export const getOrdersBycustomer = (credentials) => {
  return {
    type: GET_ORDER_BY_CUSTOMER,
    payload: api.getOrdersBycustomer(credentials)
  }
}
export const fetchPendingOrders = (data) => {
  return {
    type: PENDING_ORDERS,
    payload: api.fetchPendingOrders(data)
  }
}
export const searchByCustomerOrOrder = (data) => {
  return {
    type: SEARCH_BY_CUSTMER_OR_ORDER,
    payload: api.searchByCustomerOrOrder(data)
  }
}
export const searchByOrder = (data) => {
  return {
    type: SEARCH_BY_ORDER,
    payload: api.searchByOrder(data)
  }
}
export const fetchRecapLogsMatrix = (data) => {
  return {
    type: RECAP_LOGS_MATRIX,
    payload: api.fetchRecapLogsMatrix(data)
  }
}

export const revertOrder = (data) => {
  return {
    type: REVERT_ORDER,
    payload: api.revertOrder(data)
  }
}

export const chargeForExchange = (data) => {
  return {
    type: CHARGE_FOR_EXCHANGE,
    payload: api.chargeForExchange(data)
  }
}
export const getOrderActivity = (data) => {
  return {
    type: GET_ORDER_ACTIVITY,
    payload: api.getOrderActivity(data)
  }
}
export const fetchAllLiveOrders = (data) => {
  return {
    type: FETCH_ALL_LIVE_ORDERS,
    payload: api.fetchAllLiveOrders(data)
  }
}
export const recapLogsResults = (data) => {
  return {
    type: RECAP_LOGS_RESULTS,
    payload: api.recapLogsResults(data)
  }
}
export const getDownloadReceipt = (data) => {
  return {
    type: DOWNLOAD_RECEIPT,
    payload: api.getDownloadReceipt(data)
  }
}

export const downloadBulkReceipts = (data) => {
  return {
    type: DOWNLOAD_BULK_RECEIPT,
    payload: api.downloadBulkReceipts(data)
  }
}
export const getOrdersbyCompany = () => {
  return {
    type: GET_ORDERS_BY_COMPANY,
    payload: api.getOrdersbyCompany()
  }
}
export const getEtasOrders = (data) => {
  return {
    type: GET_ETAS_ORDERS,
    payload: api.getEtasOrders(data)
  }
}

export const dashreports = (data) => {
  return {
    type: GET_DASH_REPORTS,
    payload: api.dashreports(data)
  }
}

export const exportdashreports = (data) => {
  return {
    type: GET_EXPORT_DASH_REPORTS,
    payload: api.exportdashreports(data)
  }
}

export const getAllJobsForOrderLog = (data) => {
  return {
    type: GET_ALL_JOB_FOR_ORDER_LOG,
    payload: api.getAllJobsForOrderLog(data)
  }
}

export const getOrdersForPermit = (data) => {
  return {
    type: GET_ORDERS_FOR_PERMIT,
    payload: api.getOrdersForPermit(data)
  }
}
export const getOrderById = (data) => {
  return {
    type: GET_ORDER_BY_ID,
    payload: api.getOrderById(data)
  }
}

export const clearPhase = () => {
  return {
    type: CLEAR_PHASE
  }
}
/***********************************
 * Epics
 ***********************************/

// const getOrderEpic = action$ =>
//   action$.pipe(
//     ofType(GET_ORDER),
//     mergeMap(action => {
//       return fromPromise(api.getOrder(action.payload)).pipe(
//         flatMap(payload => [
//           {
//             type: GET_ORDER_SUCCESS,
//             payload
//           }
//         ]),
//         catchError(error =>
//           of({
//             type: GET_ORDER_ERROR,
//             payload: { error }
//           })
//         )
//     )})
//   );

  const getJobsByDateEpic = action$ =>
  action$.pipe(
    ofType(GET_JOB),
    mergeMap(action => {
      return fromPromise(api.getJobsByDate(action.payload)).pipe(
        flatMap(payload => [
          {
            type: GET_JOB_SUCCESS,
            payload
          }
        ]),
        catchError(error =>
          of({
            type: GET_JOB_ERROR,
            payload: { error }
          })
        )
    )})
  );
const getYardsAndDumpEpic = action$ =>
  action$.pipe(
    ofType(GET_YARDS_AND_DUMPS),
    mergeMap(action => {
      return fromPromise(api.getYardsAndDump(action.payload)).pipe(
        flatMap(payload => [
          {
            type: GET_YARDS_AND_DUMPS_SUCCESS,
            payload
          }
        ]),
        catchError(error =>
          of({
            type: GET_YARDS_AND_DUMPS_ERROR,
            payload: { error }
          })
        )
    )})
  );

// const getDriverEpic = action$ =>
//   action$.pipe(
//     ofType(GET_DRIVER),
//     mergeMap(action => {
//       return fromPromise(api.getDriver(action.payload)).pipe(
//         flatMap(payload => [
//           {
//             type: GET_DRIVER_SUCCESS,
//             payload
//           }
//         ]),
//         catchError(error =>
//           of({
//             type: GET_DRIVER_ERROR,
//             payload: { error }
//           })
//         )
//     )})
//   );

const assignDriverEpic = action$ =>
  action$.pipe(
    ofType(ASSIGN_DRIVER),
    mergeMap(action => {
      return fromPromise(api.assignDriver(action.payload)).pipe(
        flatMap(payload => [
          {
            type: ASSIGN_DRIVER_SUCCESS,
            payload
          }
        ]),
        catchError(error =>
          of({
            type:ASSIGN_DRIVER_ERROR,
            payload: { error }
          })
        )
    )})
  );

// const getLocationEpic = action$ =>
//   action$.pipe(
//     ofType(GET_LOCATION),
//     mergeMap(action => {
//       return fromPromise(api.getLocation(action.payload)).pipe(
//         flatMap(payload => [
//           {
//             type: GET_LOCATION_SUCCESS,
//             payload
//           }
//         ]),
//         catchError(error =>
//           of({
//             type:GET_LOCATION_ERROR,
//             payload: { error }
//           })
//         )
//     )})
//   );

// const addDriverEpic = action$ =>
//   action$.pipe(
//     ofType(ADD_DRIVER),
//     mergeMap(action => {
//       return fromPromise(api.addDriver(action.payload)).pipe(
//         flatMap(payload => [
//           {
//             type: ADD_DRIVER_SUCCESS,
//             payload
//           }
//         ]),
//         catchError(error =>
//           of({
//             type:ADD_DRIVER_ERROR,
//             payload: { error }
//           })
//         )
//     )})
//   );


// const updateDriverEpic = action$ =>
//   action$.pipe(
//     ofType(UPDATE_DRIVER),
//     mergeMap(action => {
//       return fromPromise(api.updateDriver(action.payload)).pipe(
//         flatMap(payload => [
//           {
//             type: UPDATE_DRIVER_SUCCESS,
//             payload
//           }
//         ]),
//         catchError(error =>
//           of({
//             type: UPDATE_DRIVER_ERROR,
//             payload: { error }
//           })
//         )
//     )})
//   );

// const deleteDriverEpic = action$ =>
//   action$.pipe(
//     ofType(DELETE_DRIVER),
//     mergeMap(action => {
//       return fromPromise(api.deleteDriver(action.payload)).pipe(
//         flatMap(payload => [
//           {
//             type: DELETE_DRIVER_SUCCESS,
//             payload
//           }
//         ]),
//         catchError(error =>
//           of({
//             type: DELETE_DRIVER_ERROR,
//             payload: { error }
//           })
//         )
//     )})
//   );


// const addTaskEpic = action$ =>
//   action$.pipe(
//     ofType(ADD_TASK),
//     mergeMap(action => {
//       return fromPromise(api.addTask(action.payload)).pipe(
//         flatMap(payload => [
//           {
//             type: ADD_TASK_SUCCESS,
//             payload
//           }
//         ]),
//         catchError(error =>
//           of({
//             type:ADD_TASK_ERROR,
//             payload: { error }
//           })
//         )
//     )})
//   );

// const updateTaskEpic = action$ =>
//   action$.pipe(
//     ofType(UPDATE_TASK),
//     mergeMap(action => {
//       return fromPromise(api.updateTask(action.payload)).pipe(
//         flatMap(payload => [
//           {
//             type: UPDATE_TASK_SUCCESS,
//             payload
//           }
//         ]),
//         catchError(error =>
//           of({
//             type:UPDATE_TASK_ERROR,
//             payload: { error }
//           })
//         )
//     )})
//   );

// const deleteTaskEpic = action$ =>
//   action$.pipe(
//     ofType(DELETE_TASK),
//     mergeMap(action => {
//       return fromPromise(api.deleteTask(action.payload)).pipe(
//         flatMap(payload => [
//           {
//             type: DELETE_TASK_SUCCESS,
//             payload
//           }
//         ]),
//         catchError(error =>
//           of({
//             type:DELETE_TASK_ERROR,
//             payload: { error }
//           })
//         )
//     )})
//   );

const incompleteJobEpic = action$ =>
  action$.pipe(
    ofType(INCOMPLETE_JOB),
    mergeMap(action => {
      return fromPromise(api.incompleteJob(action.payload)).pipe(
        flatMap(payload => [
          {
            type: INCOMPLETE_JOB_SUCCESS,
            payload
          }
        ]),
        catchError(error =>
          of({
            type:INCOMPLETE_JOB_ERROR,
            payload: { error }
          })
        )
    )})
  );

const orderDetailEpic = action$ =>
  action$.pipe(
    ofType(ORDER_DETAIL),
    mergeMap(action => {
      return fromPromise(api.getOrderDetail(action.payload)).pipe(
        flatMap(payload => [
          {
            type: ORDER_DETAIL_SUCCESS,
            payload
          }
        ]),
        catchError(error =>
          of({
            type:ORDER_DETAIL_ERROR,
            payload: { error }
          })
        )
    )})
  );

// const sendMessageEpic = action$ =>
//   action$.pipe(
//     ofType(SEND_MESSAGE),
//     mergeMap(action => {
//       return fromPromise(api.sendMessage(action.payload)).pipe(
//         flatMap(payload => [
//           {
//             type: SEND_MESSAGE_SUCCESS,
//             payload
//           }
//         ]),
//         catchError(error =>
//           of({
//             type: SEND_MESSAGE_ERROR,
//             payload: { error }
//           })
//         )
//     )})
//   );
//
// const getMessageEpic = action$ =>
//   action$.pipe(
//     ofType(GET_MESSAGE),
//     mergeMap(action => {
//       return fromPromise(api.getMessage(action.payload)).pipe(
//         flatMap(payload => [
//           {
//             type: GET_MESSAGE_SUCCESS,
//             payload
//           }
//         ]),
//         catchError(error =>
//           of({
//             type: GET_MESSAGE_ERROR,
//             payload: { error }
//           })
//         )
//     )})
//   );


const getNotificationsEpic = action$ =>
  action$.pipe(
    ofType(GET_NOTIFICATIONS),
    mergeMap(action => {
      return fromPromise(api.getNotifications(action.payload)).pipe(
        flatMap(payload => [
          {
            type: GET_NOTIFICATIONS_SUCCESS,
            payload
          }
        ]),
        catchError(error =>
          of({
            type: GET_NOTIFICATIONS_ERROR,
            payload: { error }
          })
        )
    )})
  );

const getEnterpriseNotificationsEpic = action$ =>
action$.pipe(
  ofType(GET_ENTERPRISE_NOTIFICATION),
  mergeMap(action => {
    return fromPromise(api.getEnterpriseNotifications(action.payload)).pipe(
      flatMap(payload => [
        {
          type: GET_ENTERPRISE_NOTIFICATION_SUCCESS,
          payload
        }
      ]),
      catchError(error =>
        of({
          type: GET_ENTERPRISE_NOTIFICATION_ERROR,
          payload: { error }
        })
      )
  )})
);

const downloadInvoiceEpic = action$ =>
  action$.pipe(
    ofType(DOWNLOAD_INVOICE),
    mergeMap(action => {
      return fromPromise(api.downloadReceipt(action.payload)).pipe(
        flatMap(payload => [
          {
            type: DOWNLOAD_INVOICE_SUCCESS,
            payload
          }
        ]),
        catchError(error =>
          of({
            type: DOWNLOAD_INVOICE_ERROR,
            payload: { error }
          })
        )
    )})
  );

// const updateJobIndexEpic = action$ =>
//   action$.pipe(
//     ofType(UPDATE_JOB_INDEX),
//     mergeMap(action => {
//       return fromPromise(api.updateJobIndex(action.payload)).pipe(
//         flatMap(payload => [
//           {
//             type: UPDATE_JOB_INDEX_SUCCESS,
//             payload
//           }
//         ]),
//         catchError(error =>
//           of({
//             type: UPDATE_JOB_INDEX_ERROR,
//             payload: { error }
//           })
//         )
//     )})
//   );

const saveAccessibilityEpic = action$ =>
  action$.pipe(
    ofType(SAVE_ACCESSIBILITY),
    mergeMap(action => {
     return fromPromise(api.saveAccessibility(action.payload)).pipe(
       flatMap(payload => [
         {
           type: SAVE_ACCESSIBILITY_SUCCESS,
           payload
         }
        ]),
        catchError(error =>
         of({
           type: SAVE_ACCESSIBILITY_ERROR,
           payload: { error }
          })
        )
    )})
  );

export const orderEpic = combineEpics(
  // getOrderEpic,
  getJobsByDateEpic,
  // getDriverEpic,
  assignDriverEpic,
  // getLocationEpic,
  // addDriverEpic,
  // updateDriverEpic,
  // deleteDriverEpic,
  // addTaskEpic,
  // updateTaskEpic,
  // deleteTaskEpic,
  incompleteJobEpic,
  orderDetailEpic,
  // sendMessageEpic,
  downloadInvoiceEpic,
  // getMessageEpic,
  getNotificationsEpic,
  // updateJobIndexEpic,
  saveAccessibilityEpic,
  getYardsAndDumpEpic,
  getEnterpriseNotificationsEpic
)
