import { connect } from 'react-redux'

import UserManagementComponent from './component'
import { fetchCustomers, addCostomer, deleteCustomer, updateCostomer } from '../../store/customer/duck'
import { getUser, getToken, getUserDetail } from '../../store/user/duck'
const UserManagementContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user
  }),
  // Map actions to dispatch and props
  {
    fetchCustomers,
    addCostomer,
    deleteCustomer,
    getUser,
    getUserDetail,
    updateCostomer
  }
)(UserManagementComponent)

export default UserManagementContainer
