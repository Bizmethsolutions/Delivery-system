import { connect } from 'react-redux'

import CustomersComponent from './component'
import { fetchCustomers, addCostomer, deleteCustomer, updateCostomer } from '../../store/customer/duck'
import { getToken } from '../../store/user/duck'
const CustomersContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user
  }),
  // Map actions to dispatch and props
  {
    fetchCustomers,
    addCostomer,
    deleteCustomer,
    getToken,
    updateCostomer
  }
)(CustomersComponent)

export default CustomersContainer
