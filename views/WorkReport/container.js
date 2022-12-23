import { connect } from 'react-redux'

import ReportsComponent from './component'
import { fetchOrdersReport, exportdashreports, getContainer, recapLogsResults, getDownloadReceipt, downloadBulkReceipts, dashreports } from '../../store/order/duck'
import { getCompanyOrders } from '../../store/user/duck'
import { fetchCustomers } from '../../store/customer/duck'
const ReportsContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user
  }),
  // Map actions to dispatch and props
  {
    fetchOrdersReport,
    getContainer,
    recapLogsResults,
    getDownloadReceipt,
    downloadBulkReceipts,
    fetchCustomers,
    dashreports,
    getCompanyOrders,
    exportdashreports
  }
)(ReportsComponent)

export default ReportsContainer
