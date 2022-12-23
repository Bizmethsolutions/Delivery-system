import { connect } from 'react-redux'

import CustomerJobsStatusComponent from './component'
import { getOrdersBycustomer, getLocation, getEtasOrders } from '../../store/order/duck'
const CustomerJobsStatusContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user,
  }),
  // Map actions to dispatch and props
  {
    getOrdersBycustomer,
    getLocation,
    getEtasOrders
  }
)(CustomerJobsStatusComponent)

export default CustomerJobsStatusContainer
