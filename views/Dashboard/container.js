import { connect } from 'react-redux'

import DashboardComponent from './component'

import { fetchPendingOrders, applyCoupon, getEnterpriseNotifications, revertOrder, getAllOrders, getContainer, updateOrder, getYardsAndDump, getOrderDetailById, fetchRecapLogsMatrix, fetchAllLiveOrders, getOrder, getJobsByDate, getLocation, getOrderDetail, getAllJobsForOrderLog } from '../../store/order/duck'
import { getHaulers } from '../../store/hauler/duck'
import { getUser, checkZip, getZipPricing } from '../../store/user/duck'
import { getDumps } from '../../store/yard/duck'
import { fetchCustomers, addCostomer, addCard } from '../../store/customer/duck'

const DashboardContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user
  }),
  // Map actions to dispatch and props
  {
    fetchPendingOrders,
    addCard,
    revertOrder,
    applyCoupon,
    checkZip,
    getContainer,
    fetchCustomers,
    fetchRecapLogsMatrix,
    addCostomer,
    fetchAllLiveOrders,
    getHaulers,
    getYardsAndDump,
    getZipPricing,
    getOrderDetailById,
    getAllOrders,
    getEnterpriseNotifications,
    getOrder,
    getJobsByDate,
    getLocation,
    getOrderDetail,
    updateOrder,
    getUser,
    getDumps,
    getAllJobsForOrderLog

  }
)(DashboardComponent)

export default DashboardContainer
