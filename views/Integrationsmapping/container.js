import { connect } from 'react-redux'

import IntegrationsmapComponent from './component'
import { updateCompany  } from '../../store/admin/duck'
import { getUser  } from '../../store/user/duck'
const IntegrationsmapContainer = connect(
  // Map state to props
  (state) => ({
    user: state.user.user,
  }),
  // Map actions to dispatch and props
  {
    updateCompany,
    getUser
  }
)(IntegrationsmapComponent)

export default IntegrationsmapContainer
