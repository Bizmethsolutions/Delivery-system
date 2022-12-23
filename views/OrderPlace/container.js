import { connect } from 'react-redux'

import OrderPlaceComponent from './component'

const OrderPlaceContainer = connect(
  // Map state to props
  (/*state*/) => ({}),
  // Map actions to dispatch and props
  {}
)(OrderPlaceComponent)

export default OrderPlaceContainer
