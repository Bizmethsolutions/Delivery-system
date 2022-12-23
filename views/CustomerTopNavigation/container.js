import { connect } from 'react-redux'

import TopNavigationComponent from './component'

import { getUser, getToken } from '../../store/user/duck'
import { searchByCustomerOrOrder, searchByOrder } from '../../store/order/duck'
import { getContainer, viewedNotification, getNotifications, getEnterpriseNotifications } from '../../store/order/duck'
const TopNavigationContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user,
    enterpriseNotifications:state.order.enterpriseNotifications
  }),
  // Map actions to dispatch and props
  {
    getUser,
    searchByCustomerOrOrder,
    getToken,
    getContainer,
    viewedNotification,
    getEnterpriseNotifications,
    searchByOrder,
    getNotifications
  }
)(TopNavigationComponent)

export default TopNavigationContainer
