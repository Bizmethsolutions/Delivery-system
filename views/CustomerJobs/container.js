import { connect } from 'react-redux'

import CustomerJobsComponent from './component'
import { addOrder, getOrdersBycustomer, chargeForExchange, applyCoupon, getAllOrdersOfCustomer, getOrderByOrderId, deleteOrder, getDownloadReceipt, getOrderActivity, getContainer, exchangeOrder, updateOrder, removalOrder } from '../../store/order/duck'
import { getHaulers } from '../../store/hauler/duck'
import { getDumps } from '../../store/yard/duck'
import { getUser, checkZip } from '../../store/user/duck'
import { fetchCustomers, addCard, addCostomer } from '../../store/customer/duck'

const CustomerJobsContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user,
  }),
  // Map actions to dispatch and props
  {
    addCard,
    addOrder,
    getOrdersBycustomer,
    getAllOrdersOfCustomer,
    deleteOrder,
    getContainer,
    checkZip,
    applyCoupon,
    getHaulers,
    getDownloadReceipt,
    addCostomer,
    getOrderActivity,
    getUser,
    chargeForExchange,
    getContainer,
    getOrderByOrderId,
    fetchCustomers,
    exchangeOrder,
    updateOrder,
    removalOrder,
    getDumps
  }
)(CustomerJobsComponent)

export default CustomerJobsContainer
