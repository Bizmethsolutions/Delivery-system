import { connect } from 'react-redux'

import ReportsMainComponent from './component'
import { fetchOrdersReport, getContainer, getOrderByOrderId, exportreport, exportall } from '../../store/order/duck'
const ReportsMainContainer = connect(
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
)(ReportsMainComponent)

export default ReportsMainContainer
