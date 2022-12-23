import { connect } from 'react-redux'

import CustomerOrdersComponent from './component'
import { fetchCustomers, addCard, addCostomer } from '../../store/customer/duck'
import { getHaulers } from '../../store/hauler/duck'
import { getUser, getToken, checkZip, getZipPricing } from '../../store/user/duck'
import { getDumps } from '../../store/yard/duck'
import { getPermitsByOrder, updatePermit, deletePermit, getPermitByOrderId, addPermit  } from '../../store/permit/duck'
import { addOrder, getAllOrders, getOrderById, sendNewOrderNotification, getOrderByOrderId, getDownloadReceipt, deleteOrder, chargeForExchange, applyCoupon, revertOrder, getOrderActivity, completeOrder, getContainer, uploadFile, exchangeOrder, updateOrder, removalOrder, enterpriseMessage, getMessage, getOrdersBycustomer, getOrdersbyCompany } from '../../store/order/duck'

const CustomerOrdersContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user,
  }),
  // Map actions to dispatch and props
  {
    fetchCustomers,
    addCard,
    getHaulers,
    getOrderByOrderId,
    getUser,
    addOrder,
    getAllOrders,
    checkZip,
    sendNewOrderNotification,
    addCostomer,
    deleteOrder,
    getContainer,
    getZipPricing,
    exchangeOrder,
    updateOrder,
    removalOrder,
    addPermit,
    getDumps,
    enterpriseMessage,
    uploadFile,
    completeOrder,
    getPermitByOrderId ,
    getMessage,
    revertOrder,
    chargeForExchange,
    applyCoupon,
    getOrderActivity,
    getToken,
    getOrdersBycustomer,
    getDownloadReceipt,
    getOrdersbyCompany,
    getPermitsByOrder,
    deletePermit,
    updatePermit,
    getOrderById
  }
)(CustomerOrdersComponent)

export default CustomerOrdersContainer
