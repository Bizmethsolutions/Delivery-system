import { connect } from 'react-redux'

import SelectMaterialsComponent from './component'

const SelectMaterialsContainer = connect(
  // Map state to props
  (/*state*/) => ({}),
  // Map actions to dispatch and props
  {}
)(SelectMaterialsComponent)

export default SelectMaterialsContainer
