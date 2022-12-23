import { Record, List } from 'immutable'
import { NOT_FOUND } from 'http-status-codes'

import reducer, {
  isAdmin,
  isSuperAdmin,
  loginUser,
  LOGIN_USER,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_ERROR,
  LOGIN_USER_CANCELLED,

  fetchUser,
  FETCH_USER,
  FETCH_USER_SUCCESS,
  FETCH_USER_ERROR,
  cancelFetchUser,
  FETCH_USER_CANCELLED,

  patchAccountDetails,
  PATCH_ACCOUNT_DETAILS,
  PATCH_ACCOUNT_DETAILS_SUCCESS,
  PATCH_ACCOUNT_DETAILS_ERROR,
  cancelPatchAccountDetails,
  PATCH_ACCOUNT_DETAILS_CANCELLED,

  fetchAdminUser,
  FETCH_ADMIN_USER,
  FETCH_ADMIN_USER_SUCCESS,
  FETCH_ADMIN_USER_ERROR,
  FETCH_ADMIN_USER_CANCELLED,

  createUser,
  CREATE_USER,
  CREATE_USER_SUCCESS,
  CREATE_USER_ERROR,
  CREATE_USER_CANCELLED,

  fetchAccountDetails,
  FETCH_ACCOUNT_DETAILS,
  FETCH_ACCOUNT_DETAILS_SUCCESS,
  FETCH_ACCOUNT_DETAILS_ERROR,
  cancelFetchAccountDetails,
  FETCH_ACCOUNT_DETAILS_CANCELLED,

  sendResetEmail,
  SEND_RESET_EMAIL,
  SEND_RESET_EMAIL_SUCCESS,
  SEND_RESET_EMAIL_ERROR,
  cancelSendResetEmail,
  SEND_RESET_EMAIL_CANCELLED,
  sendResetEmailInit,
  SEND_RESET_EMAIL_INIT,

  resetPassword,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  cancelResetPassword,
  RESET_PASSWORD_CANCELLED,
  resetPasswordInit,
  RESET_PASSWORD_INIT,

  handleSignOut,
  SIGN_OUT,
  SIGN_OUT_SUCCESS,

  getUsers,
  GET_USERS,
  GET_USERS_SUCCESS,
  GET_USERS_ERROR,
  GET_USERS_CANCELLED,

  clearUserError,
  CLEAR_USER_ERROR
} from '../duck'
import * as phases from '../../../constants/phase'

import responseFixture from './responseFixture'
import postFixture from './postObject'

describe('User selectors', () => {
  it('isAdmin() test', () => {
    expect(isAdmin({ user: { roles: ['test'] } })).toBe(false)
  })

  it('isSuperAdmin() test', () => {
    expect(isSuperAdmin({ user: { roles: ['test'] } })).toBe(false)
  })
})

describe('User actions', () => {
  it('creates an action to login user', () => {
    const expectedAction = {
      type: LOGIN_USER,
      payload: 'test'
    }
    expect(loginUser('test')).toEqual(expectedAction)
  })

  it('creates an action to fetch user', () => {
    const expectedAction = {
      type: FETCH_USER
    }
    expect(fetchUser()).toEqual(expectedAction)
  })

  it('creates an action to cancel fetch user', () => {
    const expectedAction = {
      type: FETCH_USER_CANCELLED
    }
    expect(cancelFetchUser()).toEqual(expectedAction)
  })

  it('creates an action to fetch admin user', () => {
    const expectedAction = {
      type: FETCH_ADMIN_USER
    }
    expect(fetchAdminUser()).toEqual(expectedAction)
  })

  it('creates an action to create user', () => {
    const expectedAction = {
      type: CREATE_USER,
      payload: { data: 'test' }
    }
    expect(createUser('test')).toEqual(expectedAction)
  })

  it('creates an action to fetch account details', () => {
    const expectedAction = {
      type: FETCH_ACCOUNT_DETAILS,
      payload: 'test'
    }
    expect(fetchAccountDetails('test')).toEqual(expectedAction)
  })

  it('creates an action to cancel fetch account details', () => {
    const expectedAction = {
      type: FETCH_ACCOUNT_DETAILS_CANCELLED
    }
    expect(cancelFetchAccountDetails()).toEqual(expectedAction)
  })

  it('creates an action to patch account details', () => {
    const expectedAction = {
      type: PATCH_ACCOUNT_DETAILS,
      payload: { user: 'test', id: 'test' }
    }
    expect(patchAccountDetails('test', 'test')).toEqual(expectedAction)
  })

  it('creates an action to cancel patch account details', () => {
    const expectedAction = {
      type: PATCH_ACCOUNT_DETAILS_CANCELLED
    }
    expect(cancelPatchAccountDetails()).toEqual(expectedAction)
  })

  it('creates an action to send reset email', () => {
    const expectedAction = {
      type: SEND_RESET_EMAIL,
      payload: 'test'
    }
    expect(sendResetEmail('test')).toEqual(expectedAction)
  })

  it('creates an action to cancel send reset email', () => {
    const expectedAction = {
      type: SEND_RESET_EMAIL_CANCELLED
    }
    expect(cancelSendResetEmail()).toEqual(expectedAction)
  })

  it('creates an action to send reset email init', () => {
    const expectedAction = {
      type: SEND_RESET_EMAIL_INIT
    }
    expect(sendResetEmailInit()).toEqual(expectedAction)
  })

  it('creates an action to reset password', () => {
    const expectedAction = {
      type: RESET_PASSWORD,
      payload: 'test'
    }
    expect(resetPassword('test')).toEqual(expectedAction)
  })

  it('creates an action to cancel reset password', () => {
    const expectedAction = {
      type: RESET_PASSWORD_CANCELLED
    }
    expect(cancelResetPassword()).toEqual(expectedAction)
  })

  it('creates an action to reset password init', () => {
    const expectedAction = {
      type: RESET_PASSWORD_INIT
    }
    expect(resetPasswordInit()).toEqual(expectedAction)
  })

  it('creates an action to handle sign out', () => {
    const expectedAction = {
      type: SIGN_OUT
    }
    expect(handleSignOut()).toEqual(expectedAction)
  })

  it('creates an action to get users', () => {
    const expectedAction = {
      type: GET_USERS
    }
    expect(getUsers()).toEqual(expectedAction)
  })

  it('creates an action to clear user error', () => {
    const expectedAction = {
      type: CLEAR_USER_ERROR
    }
    expect(clearUserError()).toEqual(expectedAction)
  })
})

describe('User reducer', () => {
  it('returns initial state', () => {
    const state = reducer()
    expect(state).toBeInstanceOf(Record)
    expect(state.phase).toBe(phases.INIT)
    expect(state.patchPhase).toBe(phases.INIT)
    expect(state.adminPhase).toBe(phases.INIT)
    expect(state.resetPhase).toBe(phases.INIT)
    expect(state.user).toBe(null)
    expect(state.users).toBe(null)
    expect(state.admin).toBe(null)
    expect(state.error).toBe(null)
    expect(state.isSubmitting).toBe(false)
    expect(state.token).toBe(null)
  })

  describe('login user', () => {
    it('login user action', () => {
      const action = {
        type: LOGIN_USER
      }
      const state = reducer(undefined, action)
      expect(state.phase).toBe(phases.LOADING)
      expect(state.error).toBe(null)
      expect(state.isSubmitting).toBe(false)
    })

    it('success action', () => {
      const action = {
        type: LOGIN_USER_SUCCESS,
        payload: { token: 'test' }
      }
      const state = reducer(undefined, action)
      expect(state.error).toBe(null)
      expect(state.phase).toBe(phases.SUCCESS)
      expect(state.isSubmitting).toBe(false)
      expect(state.token).toBe('test')
    })

    it('error action', () => {
      const error = { statusCode: NOT_FOUND }
      const action = {
        type: LOGIN_USER_ERROR,
        payload: { error }
      }
      const state = reducer(undefined, action)
      expect(state.token).toBe(null)
      expect(state.user).toBe(null)
      expect(state.error).toBe(error)
      expect(state.phase).toBe(phases.ERROR)
      expect(state.isSubmitting).toBe(false)
    })

    it('cancel action', () => {
      const action = {
        type: LOGIN_USER_CANCELLED
      }
      const state = reducer(undefined, action)
      expect(state.phase).toBe(phases.INIT)
      expect(state.error).toBe(null)
      expect(state.isSubmitting).toBe(false)
    })
  })

  describe('create user', () => {
    it('create user action', () => {
      const action = {
        type: CREATE_USER
      }
      const state = reducer(undefined, action)
      expect(state.adminPhase).toBe(phases.LOADING)
      expect(state.error).toBe(null)
      expect(state.isSubmitting).toBe(true)
    })

    it('success action', () => {
      const action = {
        type: CREATE_USER_SUCCESS,
        payload: { user: 'test' }
      }
      const state = reducer(undefined, action)
      expect(state.admin).toBe('test')
      expect(state.adminPhase).toBe(phases.SUCCESS)
      expect(state.error).toBe(null)
      expect(state.isSubmitting).toBe(false)
    })
  })

  describe('patch account details', () => {
    it('patch account details action', () => {
      const action = {
        type: PATCH_ACCOUNT_DETAILS
      }
      const state = reducer(undefined, action)
      expect(state.patchPhase).toBe(phases.LOADING)
      expect(state.error).toBe(null)
      expect(state.isSubmitting).toBe(true)
    })

    it('success action', () => {
      const action = {
        type: PATCH_ACCOUNT_DETAILS_SUCCESS,
        payload: { user: 'test' }
      }
      const state = reducer(undefined, action)
      expect(state.user).toBe('test')
      expect(state.patchPhase).toBe(phases.SUCCESS)
      expect(state.error).toBe(null)
      expect(state.isSubmitting).toBe(false)
    })

    it('error action', () => {
      const action = {
        type: PATCH_ACCOUNT_DETAILS_ERROR,
        payload: { error: 'test' }
      }
      const state = reducer(undefined, action)
      expect(state.error).toBe('test')
      expect(state.patchPhase).toBe(phases.ERROR)
      expect(state.isSubmitting).toBe(false)
    })

    it('cancel action', () => {
      const action = {
        type: PATCH_ACCOUNT_DETAILS_CANCELLED
      }
      const state = reducer(undefined, action)
      expect(state.error).toBe(null)
      expect(state.patchPhase).toBe(phases.INIT)
      expect(state.isSubmitting).toBe(false)
    })
  })

  describe('send reset email', () => {
    it('send reset email action', () => {
      const action = {
        type: SEND_RESET_EMAIL
      }
      const state = reducer(undefined, action)
      expect(state.phase).toBe(phases.LOADING)
      expect(state.error).toBe(null)
      expect(state.isSubmitting).toBe(true)
    })

    it('success action', () => {
      const action = {
        type: SEND_RESET_EMAIL_SUCCESS,
        payload: { user: 'test' }
      }
      const state = reducer(undefined, action)
      expect(state.user).toBe('test')
      expect(state.phase).toBe(phases.SUCCESS)
      expect(state.error).toBe(null)
      expect(state.isSubmitting).toBe(false)
    })

    it('error action', () => {
      const action = {
        type: SEND_RESET_EMAIL_ERROR,
        payload: { error: 'test' }
      }
      const state = reducer(undefined, action)
      expect(state.error).toBe('test')
      expect(state.phase).toBe(phases.ERROR)
      expect(state.isSubmitting).toBe(false)
    })

    it('init action', () => {
      const action = {
        type: SEND_RESET_EMAIL_INIT
      }
      const state = reducer(undefined, action)
      expect(state.phase).toBe(phases.INIT)
      expect(state.error).toBe(null)
      expect(state.isSubmitting).toBe(false)
    })
  })

  describe('reset password', () => {
    it('reset password action', () => {
      const action = {
        type: RESET_PASSWORD
      }
      const state = reducer(undefined, action)
      expect(state.resetPhase).toBe(phases.LOADING)
      expect(state.error).toBe(null)
      expect(state.isSubmitting).toBe(true)
    })

    it('success action', () => {
      const action = {
        type: RESET_PASSWORD_SUCCESS,
        payload: { token: 'test' }
      }
      const state = reducer(undefined, action)
      expect(state.token).toBe('test')
      expect(state.resetPhase).toBe(phases.SUCCESS)
      expect(state.error).toBe(null)
      expect(state.isSubmitting).toBe(false)
    })

    it('error action', () => {
      const action = {
        type: RESET_PASSWORD_ERROR,
        payload: { error: 'test' }
      }
      const state = reducer(undefined, action)
      expect(state.error).toBe('test')
      expect(state.resetPhase).toBe(phases.ERROR)
      expect(state.isSubmitting).toBe(false)
    })

    it('cancel action', () => {
      const action = {
        type: RESET_PASSWORD_CANCELLED
      }
      const state = reducer(undefined, action)
      expect(state.resetPhase).toBe(phases.INIT)
      expect(state.error).toBe(null)
      expect(state.isSubmitting).toBe(false)
    })
  })

  describe('get users', () => {
    it('success action', () => {
      const action = {
        type: GET_USERS_SUCCESS,
        payload: 'test'
      }
      const state = reducer(undefined, action)
      expect(state.users).toBe('test')
      expect(state.phase).toBe(phases.SUCCESS)
      expect(state.error).toBe(null)
      expect(state.isSubmitting).toBe(false)
    })
  })

  describe('fetch admin user', () => {
    it('success action', () => {
      const action = {
        type: FETCH_ADMIN_USER_SUCCESS,
        payload: 'test'
      }
      const state = reducer(undefined, action)
      expect(state.admin).toBe('test')
      expect(state.phase).toBe(phases.SUCCESS)
      expect(state.error).toBe(null)
      expect(state.isSubmitting).toBe(false)
    })
  })

  describe('sign out', () => {
    it('sign out action', () => {
      const action = {
        type: SIGN_OUT
      }
      const state = reducer(undefined, action)

      expect(state).toBeInstanceOf(Record)
      expect(state.phase).toBe(phases.INIT)
      expect(state.patchPhase).toBe(phases.INIT)
      expect(state.adminPhase).toBe(phases.INIT)
      expect(state.resetPhase).toBe(phases.INIT)
      expect(state.user).toBe(null)
      expect(state.users).toBe(null)
      expect(state.admin).toBe(null)
      expect(state.error).toBe(null)
      expect(state.isSubmitting).toBe(false)
      expect(state.token).toBe(null)
    })
  })

  describe('clear user', () => {
    it('error action', () => {
      const action = {
        type: CLEAR_USER_ERROR
      }
      const state = reducer(undefined, action)
      expect(state.error).toBe(null)
      expect(state.phase).toBe(phases.INIT)
    })
  })
})

// TODO: epic test
