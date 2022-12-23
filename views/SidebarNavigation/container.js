import { connect } from 'react-redux'

import SidebarNavigationComponent from './component'
import { StateObservable } from 'redux-observable'
import { getToken  } from '../../store/user/duck'
import { getPermitCount } from '../../store/permit/duck'
const SidebarNavigationContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user,
    permitCount: state.permit.permitCount   
  }),
  // Map actions to dispatch and props
  {
    getToken,
    getPermitCount
  }
)(SidebarNavigationComponent)

export default SidebarNavigationContainer
