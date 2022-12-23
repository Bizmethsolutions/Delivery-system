import { connect } from 'react-redux'

import DvirComponent from './component'
import { getToken } from '../../store/user/duck'
import { getTrucksDvir } from '../../store/driver/duck'
const DvirContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user
  }),
  // Map actions to dispatch and props
  {

    getToken,
    getTrucksDvir
  }
)(DvirComponent)

export default DvirContainer
