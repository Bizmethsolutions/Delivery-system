import { connect } from 'react-redux'

import PersonalContainerSizeComponent from './component'

const PersonalContainerSizeContainer = connect(
  // Map state to props
  (/*state*/) => ({}),
  // Map actions to dispatch and props
  {}
)(PersonalContainerSizeComponent)

export default PersonalContainerSizeContainer
