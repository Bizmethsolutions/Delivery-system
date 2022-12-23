import { connect } from 'react-redux'

import ReportsComponent from './component'
import { fetchOrdersReport, getContainer, recapLogsResults, getDownloadReceipt, downloadBulkReceipts, getAllJobsForOrderLog } from '../../store/order/duck'
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
    getAllJobsForOrderLog
  }
)(ReportsComponent)

export default ReportsContainer
