import { connect } from 'react-redux'

import OrderPlacedComponent from './component'

const OrderPlacedContainer = connect(
  // Map state to props
  (/*state*/) => ({}),
  // Map actions to dispatch and props
  {}
)(OrderPlacedComponent)

export default OrderPlacedContainer
