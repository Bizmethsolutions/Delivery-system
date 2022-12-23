import { connect } from 'react-redux'
import DashboardForm from './component'
import { getOrder, getDriver, assignDriver, sendMessage, clearPhase, getMessage, getOrderByOrderId, getNotifications, saveAccessibility, addDriver, updateDriver, deleteDriver, addTask, updateTask, deleteTask, incompleteJob, getOrderDetail, getLocation, downloadReceipt, updateJobIndex } from '../../store/order/duck'
import {  createLabel, getLabel, deleteLabel, updateLabel, assignLabel, clearPhaseLabel } from '../../store/label/duck'
import {  getDrivers } from '../../store/driver/duck'
import { getUser } from '../../store/user/duck'
import { getHaulers, getHaulerDetails } from '../../store/hauler/duck'

const Dashboard = connect(
  // Map state to props
  (state) => ({
    user: state.user.user,
    userPhase: state.user.user,

  }),
  // Map actions to props
  {
    getOrder,
    getDriver,
    assignDriver,
    addDriver,
    deleteDriver,
    updateDriver,
    addTask,
    getMessage,
    updateTask,
    deleteTask,
    incompleteJob,
    getOrderDetail,
    downloadReceipt,
    clearPhase,
    getLocation,
    updateJobIndex,
    createLabel,
    clearPhaseLabel,
    sendMessage,
    getOrderByOrderId,
    getLabel,
    getNotifications,
    updateLabel,
    deleteLabel,
    saveAccessibility,
    assignLabel,
    getUser,
    getDrivers,
    getHaulers,
    getHaulerDetails
  }
)(DashboardForm)
export default Dashboard
