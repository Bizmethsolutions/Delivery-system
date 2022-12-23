import { connect } from 'react-redux'

import SelectTimeComponent from './component'

const SelectTimeContainer = connect(
  // Map state to props
  (/*state*/) => ({}),
  // Map actions to dispatch and props
  {}
)(SelectTimeComponent)

export default SelectTimeContainer
