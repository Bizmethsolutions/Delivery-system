import { connect } from 'react-redux'

import UserDetailsComponent from './component'

const UserDetailsContainer = connect(
  // Map state to props
  (/*state*/) => ({}),
  // Map actions to dispatch and props
  {}
)(UserDetailsComponent)

export default UserDetailsContainer
