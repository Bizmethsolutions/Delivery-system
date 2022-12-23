import { connect } from 'react-redux'

import BusinessConfirmationFormComponent from './component'

const BusinessConfirmationFormContainer = connect(
  // Map state to props
  (/*state*/) => ({}),
  // Map actions to dispatch and props
  {}
)(BusinessConfirmationFormComponent)

export default BusinessConfirmationFormContainer
