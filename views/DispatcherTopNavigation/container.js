import { connect } from 'react-redux'

import DispatcherTopNavigationComponent from './component'
import { getToken, getUser  } from '../../store/user/duck'
import { getNotifications, viewedNotification } from '../../store/order/duck'
import { getHaulers } from '../../store/hauler/duck'
const DispatcherTopNavigationContainer = connect(
  // Map state to props
  (state) => ({
    notifications: state.order.notifications
  }),
  // Map actions to dispatch and props
  {
    getToken,
    getUser,
    getNotifications,
    viewedNotification,
    getHaulers
  }
)(DispatcherTopNavigationComponent)

export default DispatcherTopNavigationContainer
