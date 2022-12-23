import { connect } from 'react-redux'

import ReportsComponent from './component'
import { fetchOrdersReport, getContainer, getOrderByOrderId, exportreport, exportall } from '../../store/order/duck'
const ReportsContainer = connect(
  // Map state to props
  (state) => ({    
    user: state.user.user,
  }),
  // Map actions to dispatch and props
  {
    fetchOrdersReport,
    getContainer,
    getOrderByOrderId,
    exportreport,
    exportall
  }
)(ReportsComponent)

export default ReportsContainer
