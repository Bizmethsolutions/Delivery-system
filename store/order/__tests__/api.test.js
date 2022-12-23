import nock from 'nock'
import { OK } from 'http-status-codes'

import * as api from '../api'
import UserModel from '../user-model'

import responseFixture from './responseFixture'
import postObject from './postObject'
import postResponseObject from './postResponseObject'

const HOSTNAME = process.env.API_HOSTNAME

describe('Users API', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('loginUser() test', () => {
    it('login user', () => {
      nock(`${HOSTNAME}`)
        .post('/session')
        .reply(OK, postResponseObject)

      return api.loginUser(postObject)
        .then((payload) => {
          expect(payload).toBeDefined()
        })
    })
  })

  describe('fetchUser() test', () => {
    it('fetch user', () => {
      nock(`${HOSTNAME}`)
        .get('/me')
        .reply(OK, responseFixture)

      return api.fetchUser()
        .then((payload) => {
          expect(payload.user).toBeInstanceOf(UserModel)
        })
    })

    it('throw error "Sorry something went wrong!: invalid user profile returned!"', () => {
      nock(`${HOSTNAME}`)
        .get('/me')
        .reply(OK, { data: ['test'] })

      return api.fetchUser()
        .catch((err) => {
          expect(err.message).toBe('Sorry something went wrong!: invalid user profile returned!')
        })
    })

    it('throw error "error"', () => {
      nock(`${HOSTNAME}`)
        .get('/me')
        .reply(OK, { message: 'error' })

      return api.fetchUser()
        .catch((err) => {
          expect(err.message).toBe('error')
        })
    })
  })

  describe('fetchAdminUser() test', () => {
    it('fetch admin user', () => {
      nock(`${HOSTNAME}`)
        .get('/users?filter[roles]=admin')
        .reply(OK, responseFixture)

      return api.fetchAdminUser()
        .then((payload) => {
          expect(payload).toBeInstanceOf(Array)
        })
    })

    it('throw error "error"', () => {
      nock(`${HOSTNAME}`)
        .get('/users?filter[roles]=admin')
        .replyWithError('error')

      return api.fetchAdminUser()
        .catch((err) => {
          expect(err.message).toMatch(/error/)
        })
    })
  })

  describe('patchAccountDetails() test', () => {
    it('patch account details', () => {
      const id = 'test'
      nock(`${HOSTNAME}`)
        .patch(`/users/${id}`)
        .reply(OK, { account: 'test' })

      return api.patchAccountDetails({ id })
        .then((payload) => {
          expect(payload.account).toBe('test')
        })
    })
  })

  describe('createUser() test', () => {
    it('create user', () => {
      nock(`${HOSTNAME}`)
        .post('/users')
        .reply(OK, { data: { data: responseFixture.data[0] } })

      return api.createUser()
        .then((payload) => {
          expect(payload).toBeInstanceOf(UserModel)
        })
    })
  })

  describe('sendResetEmail() test', () => {
    it('send reset email', () => {
      nock(`${HOSTNAME}`)
        .post('/users/forgot-password')
        .reply(OK, { data: { data: responseFixture.data[0] } })

      return api.sendResetEmail()
        .then((payload) => {
          expect(payload).toBeInstanceOf(UserModel)
        })
    })
  })

  describe('resetPassword() test', () => {
    it('reset password', () => {
      Object.defineProperty(window.location, 'search', {
        writable: true,
        value: 'http://localhost:3000/portal/activate?userId=1234&code=2345'
      })

      nock(`${HOSTNAME}`)
        .patch('/users/1234/password')
        .reply(OK, { data: { data: responseFixture.data[0] } })

      return api.resetPassword({})
        .then((payload) => {
          expect(payload).toBeInstanceOf(UserModel)
        })
    })
  })
})
