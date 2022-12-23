import { connect } from 'react-redux'

import BusinessConfirmationComponent from './component'

const BusinessConfirmationContainer = connect(
  // Map state to props
  (/*state*/) => ({}),
  // Map actions to dispatch and props
  {}
)(BusinessConfirmationComponent)

export default BusinessConfirmationContainer
