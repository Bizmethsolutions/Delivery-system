import { connect } from 'react-redux'

import UserDetailsBackComponent from './component'

const UserDetailsBackContainer = connect(
  // Map state to props
  (/*state*/) => ({}),
  // Map actions to dispatch and props
  {}
)(UserDetailsBackComponent)

export default UserDetailsBackContainer
