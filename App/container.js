import { connect } from 'react-redux'

import AppComponent from './component'

import { getToken, getUser } from '../store/user/duck'

const AppContainer = connect(
  // Map state to props
  state => ({

  }),
  // Map actions to dispatch and props
  {
    getToken,
    getUser
  }
)(AppComponent)
export default AppContainer
