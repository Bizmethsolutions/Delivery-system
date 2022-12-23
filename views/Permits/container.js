import { connect } from 'react-redux'

import PermitComponent from './component'
import { fetchCustomers, } from '../../store/customer/duck'
import { getOrdersForPermit, getContainer } from '../../store/order/duck'
import { getToken } from '../../store/user/duck'
import { getOrderListForPermit, addPermit, updatePermit, deletePermit, getPermitCount, getPermitFiltersCount } from '../../store/permit/duck'
const PermitsContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user,
    permitCount: state.permit.permitCount
  }),
  // Map actions to dispatch and props
  {
    fetchCustomers,
    getOrdersForPermit,
    getOrderListForPermit,
    addPermit,
    getContainer,
    updatePermit,
    deletePermit,
    getPermitCount,
    getPermitFiltersCount
  }
)(PermitComponent)

export default PermitsContainer
