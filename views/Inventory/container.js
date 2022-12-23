import { connect } from 'react-redux'

import InventoryComponent from './component'
import { getOrder, getContainerLoc, getJobsByDate, getLocation, getContainer, getOrderDetail, assignDriver, clearPhase, getYardsAndDump, saveAccessibility } from '../../store/order/duck'
import {getHaulerDetails } from '../../store/hauler/duck'
import { getUser, checkZip, getToken } from '../../store/user/duck'

const InventoryContainer = connect(
  // Map state to props
  (state) => ({
    orders: state.order.orders,
    jobs: state.order.jobs,
    drivers: state.order.drivers,
    trucks: state.order.trucks,
    orderDetail: state.order.orderDetail,
    orderPhase: state.order.orderPhase,
    jobPhase: state.order.jobPhase,
    orderDetailPhase: state.order.orderDetailPhase,
    yardsanddumpdata: state.order.yardsanddumpdata,
    getYardsAndDumpPhase: state.order.getYardsAndDumpPhase,
    accessibilityPhase: state.order.accessibilityPhase,
    user: state.user.user
  }),
  // Map actions to dispatch and props
  {
    getOrder,
    getJobsByDate,
    getLocation,
    getToken,
    getOrderDetail,
    assignDriver,
    clearPhase,
    saveAccessibility,
    getYardsAndDump,
    getHaulerDetails,
    getContainer,
    getContainerLoc,
    getUser
  }
)(InventoryComponent)

export default InventoryContainer
