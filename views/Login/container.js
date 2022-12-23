import { connect } from 'react-redux'

import { sendLoginCode, loginUser, getCompanyInfo, getUserDetail } from '../../store/user/duck'
import LoginComponent from './component'

const LoginContainer = connect(
  // Map state to props
  (/*state*/) => ({}),
  // Map actions to dispatch and props
  {
    sendLoginCode,
    getCompanyInfo,
    loginUser,
    getUserDetail
  }
)(LoginComponent)

export default LoginContainer
